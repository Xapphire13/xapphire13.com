import * as boom from "boom";
import {Authorized, Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Patch, Post, QueryParam} from "routing-controllers";
import {ContinuationToken, Page, createPage, getPagingAdvice} from "../pagination";
import {Inject} from "typedi";
import {Post as PostEntity} from "../models/post";
import {PostRepository} from "../repositories/post-repository";

const DEFAULT_PAGE_SIZE = 5;

@JsonController("/api")
export class PostController {
  private createPage = createPage<PostEntity>("id", post => post.id);

  constructor(@Inject("PostRepository") private repository: PostRepository) {}

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
      throw boom.notFound();
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
      throw boom.notFound();
    }

    return post;
  }
}
