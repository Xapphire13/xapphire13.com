import {Express, Request as _Request, Response} from "express";
import {Database} from "sqlite";
import {Post} from "./post";
import {PagedResponse} from "./paged-response";
import sql = require("sql-tagged-template-literal");

interface Request<TQuery = void, TParams = void, TBody = void> extends _Request {
  query: TQuery;
  params: TParams;
  body: TBody;
}

const ENABLE_WRITE = false;
const DEFAULT_PAGE_SIZE = 5;

export class PostController {
  constructor(private app: Express, private db: Database) {}

  public registerRoutes(): void {
    this.app.get("/api/posts", this.getPosts.bind(this));
    this.app.get("/api/posts/:id", this.getPost.bind(this));

    if (ENABLE_WRITE) {
      this.app.post("/api/posts", this.postPost.bind(this));
    }
  }

  private async postPost(req: Request<void, void, Post>, res: Response): Promise<Response> {
    const post = req.body;
    post.created = new Date().toJSON();
    post.lastModified = post.created;
    post.tags = post.tags ? post.tags.map(tag => tag.toLowerCase()) : [];

    // TODO, likely race condition here
    const {id} = await (await this.db.exec(sql`
      INSERT INTO Post (title, created, last_modified, markdown_text)
      VALUES (
        ${post.title},
        ${post.created},
        ${post.lastModified},
        ${post.markdownText});
      `)).get(`
      SELECT id FROM Post
      WHERE id = last_insert_rowid();
      `);

    await Promise.all(post.tags.map(async tag => {
      tag = tag.toLowerCase();

      await this.db.exec(sql`
        INSERT OR IGNORE INTO Tag (name)
        VALUES (${tag});
        `);

      await this.db.exec(sql`
        INSERT OR IGNORE INTO PostTags
        VALUES (${id}, (SELECT id FROM Tag WHERE name = ${tag}));`)
    }));

    post.id = id;

    return res.status(201).json(post);
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
