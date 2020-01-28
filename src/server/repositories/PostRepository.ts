import Post from '../entities/post';

export interface PostRepository {
  createPost(post: Post): Promise<Post>;
  getPosts(pageSize: number, from?: Date): Promise<Post[]>;
  getPost(id: string): Promise<Post | null>;
  editPost(id: string, postDelta: Partial<Post>): Promise<void>;
  deletePost(id: string): Promise<void>;
}
