import {Post} from "../models/post";
import {Database} from "sqlite";
import {PostRepository} from "./post-repository";
import Semaphore from "semaphore-async-await";
import sql = require("sql-tagged-template-literal");

export class SqlPostRepository implements PostRepository {
  private lock = new Semaphore(1);

  constructor(private db: Database) {}

  public async createPost(post: Post): Promise<Post> {
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
    return post;
  }

  public async getPost(id: number): Promise<Post> {
    const recordPromise = this.db.get(sql`
      SELECT * FROM Post
      WHERE id = ${id};`);
    const tagsPromise = this.getTagsForPost(id);

    return this.convertRecordToPost(await recordPromise, await tagsPromise);
  }

  public async getPosts(pageSize: number, fromId?: number): Promise<Post[]> {
    let records = [];

    if (fromId != undefined) {
      records = await this.db.all(sql`
        SELECT * FROM Post
        WHERE id < ${fromId}
        ORDER BY id DESC
        LIMIT ${pageSize};`);

    } else {
      records = await this.db.all(`
        SELECT * FROM Post
        ORDER BY id DESC
        LIMIT ${pageSize};`);
    }

    return Promise.all(records.map(async record => this.convertRecordToPost(record, await this.getTagsForPost(record.id))));
  }

  public async deletePost(id: number): Promise<void> {
    await this.lock.acquire();
    await this.db.exec(sql`
      DELETE FROM Post
      WHERE id = ${id}
      `);
    this.lock.release();
  }

  public async editPost(postDelta: Post): Promise<void> {
    await this.lock.acquire();

    postDelta.lastModified = new Date().toJSON();
    postDelta.tags = postDelta.tags ? postDelta.tags.map(tag => tag.toLowerCase()) : [];

    await this.db.exec(sql`
      UPDATE Post
      SET title = ${postDelta.title}, markdown_text = ${postDelta.markdownText}, last_modified = ${postDelta.lastModified}
      WHERE id = ${+postDelta.id}
      `);

    await this.processTags(+postDelta.id, postDelta.tags);

    this.lock.release();
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
