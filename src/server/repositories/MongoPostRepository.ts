import { PostRepository } from "./PostRepository";
import Semaphore from "semaphore-async-await";
import { inject, injectable } from "tsyringe";
import Post from "../entities/post";
import { Db as MongoDatabase, Collection } from "mongodb";

@injectable()
export default class MongoPostRepository implements PostRepository {
  private lock = new Semaphore(1);
  private postCollection: Collection<Post>;

  constructor(@inject("mongoDatabase") db: MongoDatabase) {
    this.postCollection = db.collection("posts");
  }

  public async createPost(post: Post): Promise<Post> {
    await this.lock.acquire();
    const result = await this.postCollection.insertOne({
      createdAt: new Date(),
      lastModified: new Date(),
      tags: post.tags ? post.tags.map(tag => tag.toLowerCase()) : [],
      title: post.title,
      markdownText: post.markdownText,
      isPublished: false
    });
    this.lock.release();

    post.id = result.insertedId.toHexString();

    return post;
  }

  public getPost(id: string): Promise<Post | null> {
    return this.postCollection.findOne({ _id: id });
  }

  public async getPosts(pageSize: number, from?: Date): Promise<Post[]> {
    return this.postCollection.find({
      createdAt: {
        $lte: from || new Date()
      }
    }).limit(pageSize).sort("createdAt", -1).toArray();
  }

  public async deletePost(id: string): Promise<void> {
    await this.lock.acquire();
    await this.postCollection.deleteOne({ _id: id });
    this.lock.release();
  }

  public async editPost(postDelta: Post): Promise<void> {
    await this.lock.acquire();

    postDelta.tags = postDelta.tags ? postDelta.tags.map(tag => tag.toLowerCase()) : [];
    const { id, ...delta } = postDelta;

    await this.postCollection.updateOne({ _id: id }, {
      $set: {
        ...delta,
        lastModified: new Date()
      }
    })

    this.lock.release();
  }
}
