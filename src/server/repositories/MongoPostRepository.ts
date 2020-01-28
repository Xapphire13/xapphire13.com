import Semaphore from 'semaphore-async-await';
import { inject, injectable } from 'tsyringe';
import { Db as MongoDatabase, Collection } from 'mongodb';
import shortid from 'shortid';
import Post from '../entities/post';
import { PostRepository } from './PostRepository';

@injectable()
export default class MongoPostRepository implements PostRepository {
  private lock = new Semaphore(1);

  private postCollection: Collection<Post>;

  constructor(@inject('mongoDatabase') db: MongoDatabase) {
    this.postCollection = db.collection('posts');
  }

  public async createPost(post: Post): Promise<Post> {
    const result = await this.postCollection.insertOne({
      _id: shortid.generate(),
      createdAt: new Date(),
      lastModified: new Date(),
      tags: post.tags ? post.tags.map(tag => tag.toLowerCase()) : [],
      title: post.title,
      markdownText: post.markdownText,
      isPublished: false
    });

    return result.ops[0];
  }

  public async getPost(id: string): Promise<Post | null> {
    const post = await this.postCollection.findOne({ _id: id });

    return post;
  }

  public async getPosts(pageSize: number, from?: Date): Promise<Post[]> {
    return this.postCollection
      .find({
        createdAt: {
          $lte: from || new Date()
        }
      })
      .limit(pageSize)
      .sort('createdAt', -1)
      .toArray();
  }

  public async deletePost(id: string): Promise<void> {
    await this.lock.acquire();
    await this.postCollection.deleteOne({ _id: id });
    this.lock.release();
  }

  public async editPost(id: string, postDelta: Partial<Post>): Promise<void> {
    // eslint-disable-next-line no-param-reassign
    postDelta.tags = postDelta.tags?.map(tag => tag.toLowerCase());

    await this.postCollection.updateOne(
      { _id: id },
      {
        $set: {
          ...postDelta,
          lastModified: new Date()
        }
      }
    );
  }
}
