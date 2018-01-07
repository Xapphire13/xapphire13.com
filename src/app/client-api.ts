import MP from "./mock-posts";
import {Post} from "./post";
const MOCK_POSTS = new Array(20).fill(null).reduce<Post[]>(p => p.concat(...MP), []);

export function getPosts(): Promise<Post[]> {
  return Promise.resolve(MOCK_POSTS);
}

export function getPost(id: string): Promise<Post> {
  const post = MOCK_POSTS.find(post => post.id === id);
  return post ? Promise.resolve(post) : Promise.reject(null);
}
