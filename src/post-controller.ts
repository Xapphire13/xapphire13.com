import * as boom from "boom";
import {Express, Request as _Request, Response} from "express";
import {Post} from "./post";
import {PagedResponse} from "./paged-response";
import {asyncRoute, protectedRoute} from "./route-helpers";
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
    this.app.get("/api/posts", this.getPosts);
    this.app.get("/api/posts/:id", this.getPost);
    this.app.post("/api/posts", protectedRoute(this.postPost));
    this.app.patch("/api/posts/:id", protectedRoute(this.patchPost));
    this.app.delete("/api/posts/:id", protectedRoute(this.deletePost));
  }

  private postPost = asyncRoute(async (req: Request<void, void, Post>, res: Response): Promise<Response> => {
    const post = await this.repository.createPost(req.body);

    return res.status(201).json(post);
  });

  private patchPost = asyncRoute(async (req: Request<void, {id: string}, Post>, res: Response): Promise<Response> => {
    const {id} = req.params;

    if (!await this.repository.getPost(+id)) {
      throw boom.notFound();
    }

    const post = req.body;
    post.id = id;
    await this.repository.editPost(post);

    return res.status(204).send();
  });

  private deletePost = asyncRoute(async (req: Request<void, {id: string}, void>, res: Response): Promise<Response> => {
    const {id} = req.params;

    if (!await this.repository.getPost(+id)) {
      throw boom.notFound();
    }

    await this.repository.deletePost(+id);

    return res.send();
  });

  private getPosts = asyncRoute(async (req: Request<{continue?: string}>, res: Response): Promise<Response> => {
    let continuationToken = req.query.continue;

    const values = await this.repository.getPosts(DEFAULT_PAGE_SIZE, continuationToken ? +continuationToken : undefined);
    continuationToken = values.length ? values[values.length - 1].id : undefined;

    return res.json(<PagedResponse<Post>>{
      values,
      continuationToken
    });
  });

  private getPost = asyncRoute(async (req: Request<void, {id: string}>, res: Response): Promise<Response> => {
    const {id} = req.params;

    const post = await this.repository.getPost(+id);

    if (!post) {
      throw boom.notFound();
    }

    return res.json(post);
  });
}
