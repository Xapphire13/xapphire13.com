import {Express, Request as _Request, Response} from "express";
import {Post} from "./post";
import {PagedResponse} from "./paged-response";
import {protectedRoute} from "./auth-helper";
import {PostRepository} from "./post-repository";

interface Request<TQuery = void, TParams = void, TBody = void> extends _Request {
  query: TQuery;
  params: TParams;
  body: TBody;
}

const DEFAULT_PAGE_SIZE = 5;

export class PostController {
  constructor(private app: Express, private repository: PostRepository) {}

  public registerRoutes(): void {
    this.app.get("/api/posts", this.getPosts.bind(this));
    this.app.get("/api/posts/:id", this.getPost.bind(this));
    this.app.post("/api/posts", protectedRoute(this.postPost.bind(this)));
    this.app.patch("/api/posts/:id", protectedRoute(this.patchPost.bind(this)));
    this.app.delete("/api/posts/:id", protectedRoute(this.deletePost.bind(this)));
  }

  private async postPost(req: Request<void, void, Post>, res: Response): Promise<Response> {
    const post = await this.repository.createPost(req.body);

    return res.status(201).json(post);
  }

  private async patchPost(req: Request<void, {id: string}, Post>, res: Response): Promise<Response> {
    const {id} = req.params;

    if (!await this.repository.getPost(+id)) {
      return res.status(404).send();
    }

    const post = req.body;
    post.id = id;
    await this.repository.editPost(post);

    return res.status(204).send();
  }

  private async deletePost(req: Request<void, {id: string}, void>, res: Response): Promise<Response> {
    const {id} = req.params;

    if (!await this.repository.getPost(+id)) {
      return res.status(404).send();
    }

    await this.repository.deletePost(+id);

    return res.send();
  }

  private async getPosts(req: Request<{continue?: string}>, res: Response): Promise<Response> {
    let continuationToken = req.query.continue;

    const values = await this.repository.getPosts(DEFAULT_PAGE_SIZE, continuationToken ? +continuationToken : undefined);
    continuationToken = values.length ? values[values.length - 1].id : undefined;

    return res.json(<PagedResponse<Post>>{
      values,
      continuationToken
    });
  }

  private async getPost(req: Request<void, {id: string}>, res: Response): Promise<Response> {
    const {id} = req.params;

    const post = await this.repository.getPost(+id);

    return post ? res.json(post) : res.status(404).send();
  }
}
