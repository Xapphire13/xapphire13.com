import {Boom, isBoom} from "boom";
import {PostController} from "../src/controllers/post-controller";
import {PostRepository} from "../src/repositories/post-repository";

test("getPost() calls through to the repository", async () => {
  const mockRepository = new MockRepository();
  const controller = new PostController(mockRepository);
  const id = "42";

  try {
    await controller.getPost(id);
  } catch {}

  expect(mockRepository.getPost.mock.calls).toEqual([[+id]]);
});

test("getPost() returns 404 when not found", async () => {
  const mockRepository = new MockRepository();
  const controller = new PostController(mockRepository);
  const id = "42";

  try {
    await controller.getPost(id);
  } catch (err) {
    expect(isBoom(err)).toBeTruthy();
    expect((<Boom>err).output.statusCode).toBe(404);
  }
});

test("getPost() returns post when found", async () => {
  const mockRepository = new MockRepository();
  const controller = new PostController(mockRepository);
  const id = "42";
  const post = {};

  mockRepository.getPost.mockReturnValue(post);

  const result = await controller.getPost(id);

  expect(result).toEqual(post);
});

// Helpers

class MockRepository implements PostRepository {
  public createPost = jest.fn();
  public deletePost = jest.fn();
  public editPost = jest.fn();
  public getPost = jest.fn();
  public getPosts = jest.fn();
}
