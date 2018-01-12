import * as express from "express";
import {PostRepository} from "../src/post-repository";
import {PostController} from "../src/post-controller";

test("getPost() calls through to the repository", async () => {
  const mockRepository = new MockRepository();
  const mockApp = new MockApp();
  const controller = new PostController(<any>mockApp, mockRepository);
  const id = "42";

  controller.registerRoutes();
  const getPost = mockApp.getHandlers["/api/posts/:id"];

  await getPost(
    <any>{params: {id}},
    <any>new MockResponse(),
    <any>null);

  expect(mockRepository.getPost.mock.calls).toEqual([[+id]]);
});

test("getPost() returns 404 when not found", async () => {
  const mockRepository = new MockRepository();
  const mockApp = new MockApp();
  const controller = new PostController(<any>mockApp, mockRepository);
  const mockResponse = new MockResponse();
  const id = "42";

  controller.registerRoutes();
  const getPost = mockApp.getHandlers["/api/posts/:id"];

  await getPost(
    <any>{params: {id}},
    <any>mockResponse,
    <any>null);

  expect(mockResponse.status.mock.calls).toEqual([[404]]);
});

test("getPost() returns post when found", async () => {
  const mockRepository = new MockRepository();
  const mockApp = new MockApp();
  const controller = new PostController(<any>mockApp, mockRepository);
  const mockResponse = new MockResponse();
  const id = "42";
  const post = {};

  mockRepository.getPost.mockReturnValue(post);
  controller.registerRoutes();
  const getPost = mockApp.getHandlers["/api/posts/:id"];

  await getPost(
    <any>{params: {id}},
    <any>mockResponse,
    <any>null);

  expect(mockResponse.json.mock.calls).toEqual([[post]]);
});

// Helpers

class MockRepository implements PostRepository {
  public createPost = jest.fn();
  public deletePost = jest.fn();
  public editPost = jest.fn();
  public getPost = jest.fn();
  public getPosts = jest.fn();
}

class MockResponse {
  public status = jest.fn().mockReturnThis();
  public send = jest.fn().mockReturnThis();
  public json = jest.fn();
}

class MockApp {
  public getHandlers: {[path: string]: express.RequestHandler} = {};
  public postHandlers: {[path: string]: express.RequestHandler} = {};
  public patchHandlers: {[path: string]: express.RequestHandler} = {};
  public deleteHandlers: {[path: string]: express.RequestHandler} = {};

  public get(path: string, handler: express.RequestHandler) {
    this.getHandlers[path] = handler;
  }

  public post(path: string, handler: express.RequestHandler) {
    this.postHandlers[path] = handler;
  }

  public patch(path: string, handler: express.RequestHandler) {
    this.patchHandlers[path] = handler;
  }

  public delete(path: string, handler: express.RequestHandler) {
    this.deleteHandlers[path] = handler;
  }
}
