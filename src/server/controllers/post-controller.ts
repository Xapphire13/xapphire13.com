import {Authorized, Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Patch, Post, QueryParam} from "routing-controllers";
import {ContinuationToken, createPage, getPagingAdvice} from "../pagination";
import Boom from "boom";
import {PostRepository} from "../repositories/post-repository";
import {decorators} from "tsyringe";
import Page = Xapphire13.Entities.Page;
import PostEntity = Xapphire13.Entities.Post;

const {inject, injectable} = decorators;
const DEFAULT_PAGE_SIZE = 5;

@injectable()
@JsonController("/api")
export class PostController {
  private createPage = createPage<PostEntity>("id", post => post.id);

  constructor(@inject("PostRepository") private repository: PostRepository) {}

  @Post("/posts")
  @Authorized()
  @HttpCode(201)
  public async postPost(@Body() post: PostEntity): Promise<PostEntity> {
    return this.repository.createPost(post);
  }

  @Patch("/posts/:id")
  @Authorized()
  @OnUndefined(204)
  public async patchPost(@Param("id") id: string, @Body() post: PostEntity): Promise<void> {
    if (!await this.repository.getPost(+id)) {
      throw Boom.notFound();
    }

    post.id = id;
    await this.repository.editPost(post);
  }

  @Delete("/posts/:id")
  @Authorized()
  @OnUndefined(200)
  public async deletePost(@Param("id") id: string): Promise<void> {
    if (!await this.repository.getPost(+id)) {
      return;
    }

    await this.repository.deletePost(+id);
  }

  @Get("/posts")
  public async getPosts(@QueryParam("continue") continuationToken?: string): Promise<Page<PostEntity>> {
    const token = continuationToken && new ContinuationToken(continuationToken);
    const pagingAdvice = token && getPagingAdvice(DEFAULT_PAGE_SIZE, token);
    const pageSize = pagingAdvice ? pagingAdvice.limit : DEFAULT_PAGE_SIZE;
    const posts = await this.repository.getPosts(pageSize, pagingAdvice ? +pagingAdvice.from : undefined);

    return this.createPage(pageSize, posts, token || undefined);
  }

  @Get("/posts/:id")
  public async getPost(@Param("id") id: string): Promise<PostEntity> {
    const post = await this.repository.getPost(+id);

    if (!post) {
      throw Boom.notFound();
    }

    return post;
  }
}
