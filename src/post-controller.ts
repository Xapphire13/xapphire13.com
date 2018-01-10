import {Express, Request as _Request, Response} from "express";
import {Database} from "sqlite";
import {Post} from "./post";
import {PagedResponse} from "./paged-response";

interface Request<TQuery = void, TParams = void> extends _Request {
  query: TQuery;
  params: TParams;
}

const DEFAULT_PAGE_SIZE = 5;

export class PostController {
  constructor(private app: Express, private db: Database) {}

  public registerRoutes(): void {
    this.app.get("/api/posts", this.getPosts.bind(this));
    this.app.get("/api/posts/:id", this.getPost.bind(this));
  }

  private async getPosts(req: Request<{continue?: string}>, res: Response): Promise<Response> {
    const continuationToken = req.query.continue;

    let values: Post[];
    if (continuationToken) {
      const records = await this.db.all(`SELECT * FROM Post WHERE id > ${continuationToken} LIMIT ${DEFAULT_PAGE_SIZE};`);

      values = await Promise.all(records.map<Promise<Post>>(async record => this.convertRecordToPost(record, await this.getTagsForPost(record.id))));
    } else {
      const records = await this.db.all(`SELECT * FROM Post LIMIT ${DEFAULT_PAGE_SIZE};`);

      values = await Promise.all(records.map<Promise<Post>>(async record => this.convertRecordToPost(record, await this.getTagsForPost(record.id))));
    }

    return res.json(<PagedResponse<Post>>{
      values,
      continuationToken: values.length ? values[values.length - 1].id : null
    });
  }

  private async getPost(req: Request<void, {id: string}>, res: Response): Promise<Response> {
    const {id} = req.params;
    const post = this.convertRecordToPost(await this.db.get(`SELECT * FROM Post WHERE id = ${id};`), await this.getTagsForPost(+id));

    return post ? res.json(post) : res.status(404).send();
  }

  private async getTagsForPost(id: number): Promise<string[]> {
    return (await this.db.all(`SELECT name FROM Tag INNER JOIN (SELECT * FROM PostTags WHERE post_id = ${id}) AS Tags ON Tag.id = Tags.tag_id;`)).map(record => record.name);
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
