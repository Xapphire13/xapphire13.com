import {Express, Request as _Request, Response} from "express";
import {Post} from "./post";
import {PagedResponse} from "./paged-response";
import MOCK_POSTS from "./mock-posts";

interface Request<TQuery = void, TParams = void> extends _Request {
  query: TQuery;
  params: TParams;
}

const DEFAULT_PAGE_SIZE = 5;

export class PostController {
  constructor(private app: Express) {}

  public registerRoutes(): void {
    this.app.get("/api/posts", this.getPosts.bind(this));
    this.app.get("/api/posts/:id", this.getPost.bind(this));
  }

  private getPosts(req: Request<{continue?: string}>, res: Response): Response {
    const continuationToken = req.query.continue;

    let values: Post[];
    if (continuationToken) {
      const index = MOCK_POSTS.findIndex(post => post.id === continuationToken) + 1;
      values = MOCK_POSTS.slice(index, index + DEFAULT_PAGE_SIZE);
    } else {
      values = MOCK_POSTS.slice(0, DEFAULT_PAGE_SIZE);
    }

    return res.json(<PagedResponse<Post>>{
      values,
      continuationToken: values.length ? values[values.length - 1].id : null
    });
  }

  private getPost(req: Request<void, {id: string}>, res: Response): Response {
    const {id} = req.params;
    const post = MOCK_POSTS.find(post => post.id === id);

    return post ? res.json(post) : res.status(404).send();
  }
}
