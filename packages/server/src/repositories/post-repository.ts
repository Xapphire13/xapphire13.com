import Post = Xapphire13.Entities.Post;

export interface PostRepository {
  createPost(post: Post): Promise<Post>;
  getPosts(pageSize: number, fromId?: number): Promise<Post[]>;
  getPost(id: number): Promise<Post>;
  editPost(postDelta: Post): Promise<void>;
  deletePost(id: number): Promise<void>;
}
