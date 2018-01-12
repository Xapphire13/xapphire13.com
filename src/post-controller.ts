import {Express, Request as _Request, Response} from "express";
import {Database} from "sqlite";
import {Post} from "./post";
import {PagedResponse} from "./paged-response";
import {isAuthorized} from "./auth-helper";
import Semaphore from "semaphore-async-await";
import sql = require("sql-tagged-template-literal");

interface Request<TQuery = void, TParams = void, TBody = void> extends _Request {
  query: TQuery;
  params: TParams;
  body: TBody;
}

const DEFAULT_PAGE_SIZE = 5;

export class PostController {
  private lock = new Semaphore(1);

  constructor(private app: Express, private db: Database) {}

  public registerRoutes(): void {
    this.app.get("/api/posts", this.getPosts.bind(this));
    this.app.get("/api/posts/:id", this.getPost.bind(this));
    this.app.post("/api/posts", this.postPost.bind(this));
    this.app.patch("/api/posts/:id", this.patchPost.bind(this));
    this.app.delete("/api/posts/:id", this.deletePost.bind(this));
  }

  private async postPost(req: Request<void, void, Post>, res: Response): Promise<Response> {
    if (!isAuthorized()) {
      return res.status(401).send();
    }

    const post = req.body;
    post.created = new Date().toJSON();
    post.lastModified = post.created;
    post.tags = post.tags ? post.tags.map(tag => tag.toLowerCase()) : [];

    await this.lock.acquire();

    await this.db.exec(sql`
      INSERT INTO Post (title, created, last_modified, markdown_text)
      VALUES (
        ${post.title},
        ${post.created},
        ${post.lastModified},
        ${post.markdownText});
      `);

    const {id} = await this.db.get(`
      SELECT id FROM Post
      WHERE id = last_insert_rowid();
      `);

    await this.processTags(+id, post.tags);

    this.lock.release();

    post.id = id;

    return res.status(201).json(post);
  }

  private async patchPost(req: Request<void, {id: string}, Post>, res: Response): Promise<Response> {
    if (!isAuthorized()) {
      return res.status(401).send();
    }

    const {id} = req.params;
    const postPatch = req.body;
    postPatch.lastModified = new Date().toJSON();
    postPatch.tags = postPatch.tags ? postPatch.tags.map(tag => tag.toLowerCase()) : [];

    await this.lock.acquire();

    if (!await this.postExists(+id)) {
      return res.status(404).send();
    }

    await this.db.exec(sql`
      UPDATE Post
      SET title = ${postPatch.title}, markdown_text = ${postPatch.markdownText}, last_modified = ${postPatch.lastModified}
      WHERE id = ${+id}
      `);

    await this.processTags(+id, postPatch.tags);

    this.lock.release();

    return res.status(204).send();
  }

  private async deletePost(req: Request<void, {id: string}, void>, res: Response): Promise<Response> {
    const {id} = req.params;

    if (!await this.postExists(+id)) {
      return res.status(404).send();
    }

    await this.lock.acquire();
    await this.db.exec(sql`
      DELETE FROM Post
      WHERE id = ${+id}
      `);
    this.lock.release();

    return res.send();
  }

  private async getPosts(req: Request<{continue?: string}>, res: Response): Promise<Response> {
    const continuationToken = req.query.continue;

    let values: Post[];
    if (continuationToken) {
      const records = await this.db.all(sql`
        SELECT * FROM Post
        WHERE id < ${continuationToken}
        ORDER BY id DESC
        LIMIT ${DEFAULT_PAGE_SIZE};`);

      values = await Promise.all(records.map(async record => this.convertRecordToPost(record, await this.getTagsForPost(record.id))));
    } else {
      const records = await this.db.all(`
        SELECT * FROM Post
        ORDER BY id DESC
        LIMIT ${DEFAULT_PAGE_SIZE};`);

      values = await Promise.all(records.map(async record => this.convertRecordToPost(record, await this.getTagsForPost(record.id))));
    }

    return res.json(<PagedResponse<Post>>{
      values,
      continuationToken: values.length ? values[values.length - 1].id : null
    });
  }

  private async getPost(req: Request<void, {id: string}>, res: Response): Promise<Response> {
    const {id} = req.params;
    const recordPromise = this.db.get(sql`
      SELECT * FROM Post
      WHERE id = ${id};`);
    const tagsPromise = this.getTagsForPost(+id)
    const post = this.convertRecordToPost(await recordPromise, await tagsPromise);

    return post ? res.json(post) : res.status(404).send();
  }

  private postExists(id: number): Promise<boolean> {
    return this.db.get(sql`SELECT id FROM Post WHERE id = ${+id}`);
  }

  private async processTags(postId: number, tags: string[]): Promise<any> {
    return Promise.all(tags.map(async tag => {
      tag = tag.toLowerCase();

      await this.db.exec(sql`
        INSERT OR IGNORE INTO Tag (name)
        VALUES (${tag});
        `);

      await this.db.exec(sql`
        INSERT OR IGNORE INTO PostTags
        VALUES (${postId}, (SELECT id FROM Tag WHERE name = ${tag}));`)
    }));
  }

  private async getTagsForPost(id: number): Promise<string[]> {
    return (await this.db.all(sql`
      SELECT name FROM Tag
      INNER JOIN (SELECT * FROM PostTags WHERE post_id = ${id}) AS Tags
      ON Tag.id = Tags.tag_id
      ORDER BY name ASC;
      `)).map(record => record.name);
  }

  private convertRecordToPost(record: any, tags: string[]): Post {
    return record && {
      id: record.id.toString(),
      created: record.created,
      lastModified: record.last_modified,
      markdownText: record.markdown_text,
      title: record.title,
      tags
    };
  }
}
