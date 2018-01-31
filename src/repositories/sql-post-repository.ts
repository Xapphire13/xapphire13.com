import {Database} from "sqlite";
import {Post} from "../models/post";
import {PostRepository} from "./post-repository";
import Semaphore from "semaphore-async-await";

export class SqlPostRepository implements PostRepository {
  private lock = new Semaphore(1);

  constructor(private db: Database) {}

  public async createPost(post: Post): Promise<Post> {
    post.created = new Date().toJSON();
    post.lastModified = post.created;
    post.tags = post.tags ? post.tags.map(tag => tag.toLowerCase()) : [];

    await this.lock.acquire();
    await this.db.run(`
      INSERT INTO Post (title, created, last_modified, markdown_text)
      VALUES (
        $title,
        $created,
        $lastModified,
        $markdownText);
      `, {
        $title: post.title,
        $created: post.created,
        $lastModified: post.lastModified,
        $markdownText: post.markdownText
      });

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
    const recordPromise = this.db.get(`
      SELECT * FROM Post
      WHERE id = $id;`, {$id: id});
    const tagsPromise = this.getTagsForPost(id);

    return this.convertRecordToPost(await recordPromise, await tagsPromise);
  }

  public async getPosts(pageSize: number, fromId?: number): Promise<Post[]> {
    let records = [];

    if (fromId != undefined) {
      records = await this.db.all(`
        SELECT * FROM Post
        WHERE id < $fromId
        ORDER BY id DESC
        LIMIT ${pageSize};`, {$fromId: fromId});

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
    await this.db.run(`
      DELETE FROM Post
      WHERE id = $id
      `, {$id: id});
    this.lock.release();
  }

  public async editPost(postDelta: Post): Promise<void> {
    await this.lock.acquire();

    postDelta.lastModified = new Date().toJSON();
    postDelta.tags = postDelta.tags ? postDelta.tags.map(tag => tag.toLowerCase()) : [];

    await this.db.run(`
      UPDATE Post
      SET title = $title, markdown_text = $markdownText, last_modified = $lastModified
      WHERE id = $id
      `, {
        $title: postDelta.title,
        $markdownText: postDelta.markdownText,
        $lastModified: postDelta.lastModified,
        $id: +postDelta.id
      });

    await this.processTags(+postDelta.id, postDelta.tags);

    this.lock.release();
  }

  private async processTags(postId: number, tags: string[]): Promise<any> {
    return Promise.all(tags.map(async tag => {
      tag = tag.toLowerCase();

      await this.db.run(`
        INSERT OR IGNORE INTO Tag (name)
        VALUES ($tag);
        `, {$tag: tag});

      await this.db.run(`
        INSERT OR IGNORE INTO PostTags
        VALUES ($postId, (SELECT id FROM Tag WHERE name = $tag));`, {
          $postId: postId,
          $tag: tag
        });
    }));
  }

  private async getTagsForPost(id: number): Promise<string[]> {
    return (await this.db.all(`
      SELECT name FROM Tag
      INNER JOIN (SELECT * FROM PostTags WHERE post_id = $id) AS Tags
      ON Tag.id = Tags.tag_id
      ORDER BY name ASC;
      `, {$id: id})).map(record => record.name);
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
