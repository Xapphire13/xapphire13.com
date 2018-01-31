import {Boom, isBoom} from "boom";
import {PostController} from "../src/controllers/post-controller";
import {PostRepository} from "../src/repositories/post-repository";

describe("Calls to repository", () => {
  test("getPost() calls through to the repository", async () => {
    const mockRepository = new MockRepository();
    const controller = new PostController(mockRepository);
    const id = "42";

    try {
      await controller.getPost(id);
    } catch {}

    expect(mockRepository.getPost.mock.calls).toEqual([[+id]]);
  });

  test("postPost() calls through to the repository", async () => {
    const mockRepository = new MockRepository();
    const controller = new PostController(mockRepository);
    const post: any = {
      markdownText: "",
      tags: [],
      title: ""
    };

    await controller.postPost(post);

    expect(mockRepository.createPost.mock.calls).toEqual([[post]]);
  });

  test("patchPost() calls through to the repository", async () => {
    const mockRepository = new MockRepository();
    mockRepository.getPost.mockReturnValue({});
    const controller = new PostController(mockRepository);
    const id = "foo";
    const post: any = {
      markdownText: "",
      tags: [],
      title: ""
    };

    await controller.patchPost(id, post);

    expect(mockRepository.editPost.mock.calls).toEqual([[Object.assign({id}, post)]]);
  });

  test("deletePost() calls through to the repository", async () => {
    const mockRepository = new MockRepository();
    mockRepository.getPost.mockReturnValue({});
    const controller = new PostController(mockRepository);
    const id = "14";

    await controller.deletePost(id);

    expect(mockRepository.deletePost.mock.calls).toEqual([[+id]]);
  });
});

test("getPost() returns throws notFound when not found", async () => {
  const mockRepository = new MockRepository();
  const controller = new PostController(mockRepository);

  try {
    await controller.getPost("foo");
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

test("patchPost() throws notFound when not found", async () => {
  const mockRepository = new MockRepository();
  const controller = new PostController(mockRepository);

  try {
    await controller.patchPost("foo", {} as any);
  } catch (err) {
    expect(isBoom(err)).toBeTruthy();
    expect((<Boom>err).output.statusCode).toBe(404);
  }
});

test("deletePost() doesn't throw when not found", async () => {
  const mockRepository = new MockRepository();
  const controller = new PostController(mockRepository);

  await controller.deletePost("foo");
});

// Helpers

class MockRepository implements PostRepository {
  public createPost = jest.fn();
  public deletePost = jest.fn();
  public editPost = jest.fn();
  public getPost = jest.fn();
  public getPosts = jest.fn();
}
