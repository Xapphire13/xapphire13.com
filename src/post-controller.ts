import * as boom from "boom";
import {Application} from "express";
import {Post} from "./post";
import {PagedResponse} from "./paged-response";
import {PostRepository} from "./post-repository";
import {UserRepository} from "./user-repository";
import {ApiController, route, HttpMethod, RouteHandlerParams, AuthInfo} from "./api-controller";

const DEFAULT_PAGE_SIZE = 5;

export class PostController extends ApiController {
  constructor(app: Application, private repository: PostRepository, private userRepository: UserRepository) {
    super(app);
  }

  @route("posts", HttpMethod.POST)
  public async postPost({req, res, authInfo}: RouteHandlerParams<void, void, Post>): Promise<Post> {
    await this.checkAuthorization(authInfo);
    const post = await this.repository.createPost(req.body);

    res.status(201)
    return post;
  }

  @route("posts/:id", HttpMethod.PATCH)
  public async patchPost({req, res, authInfo}: RouteHandlerParams<void, {id: string}, Post>): Promise<void> {
    await this.checkAuthorization(authInfo);
    const {id} = req.params;

    if (!await this.repository.getPost(+id)) {
      throw boom.notFound();
    }

    const post = req.body;
    post.id = id;
    await this.repository.editPost(post);

    res.status(204);
  }

  @route("posts/:id", HttpMethod.DELETE)
  public async deletePost({req, authInfo}: RouteHandlerParams<void, {id: string}, void>): Promise<void> {
    await this.checkAuthorization(authInfo);
    const {id} = req.params;

    if (!await this.repository.getPost(+id)) {
      throw boom.notFound();
    }

    await this.repository.deletePost(+id);
  }

  @route("posts", HttpMethod.GET)
  public async getPosts({req}: RouteHandlerParams<{continue?: string}>): Promise<PagedResponse<Post>> {
    let continuationToken = req.query.continue || null;

    const values = await this.repository.getPosts(DEFAULT_PAGE_SIZE, continuationToken ? +continuationToken : undefined);
    continuationToken = values.length ? values[values.length - 1].id : null;

    return {
      values,
      continuationToken
    };
  }

  @route("posts/:id", HttpMethod.GET)
  public async getPost({req}: RouteHandlerParams<void, {id: string}>): Promise<Post> {
    const {id} = req.params;

    const post = await this.repository.getPost(+id);

    if (!post) {
      throw boom.notFound();
    }

    return post;
  }

  private async checkAuthorization(authInfo: AuthInfo | null): Promise<void> {
    if (!authInfo || !await this.userRepository.isAdmin((await this.userRepository.getUser(authInfo.username)).id)) {
      throw boom.unauthorized();
    }
  }
}
