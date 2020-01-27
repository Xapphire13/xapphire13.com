import { PostRepository } from "./PostRepository";
import Semaphore from "semaphore-async-await";
import { inject, injectable } from "tsyringe";
import Post from "../entities/post";
import { Db as MongoDatabase, Collection, ObjectId } from "mongodb";

@injectable()
export default class MongoPostRepository implements PostRepository {
  private lock = new Semaphore(1);
  private postCollection: Collection<Post>;

  constructor(@inject("mongoDatabase") db: MongoDatabase) {
    this.postCollection = db.collection("posts");
  }

  public async createPost(post: Post): Promise<Post> {
    const result = await this.postCollection.insertOne({
      createdAt: new Date(),
      lastModified: new Date(),
      tags: post.tags ? post.tags.map(tag => tag.toLowerCase()) : [],
      title: post.title,
      markdownText: post.markdownText,
      isPublished: false
    });

    post._id = result.insertedId;

    return post;
  }

  public async getPost(id: string): Promise<Post | null> {
    const post = await this.postCollection.findOne({ _id: new ObjectId(id) });

    if (post) {
      post._id = post._id.toHexString() as any; // TODO
    }

    return post;
  }

  public async getPosts(pageSize: number, from?: Date): Promise<Post[]> {
    return (await this.postCollection.find({
      createdAt: {
        $lte: from || new Date()
      }
    }).limit(pageSize).sort("createdAt", -1).toArray()).map(post => {
      post._id = post._id.toHexString() as any; // TODO
      return post;
    });
  }

  public async deletePost(id: string): Promise<void> {
    await this.lock.acquire();
    await this.postCollection.deleteOne({ _id: new ObjectId(id) });
    this.lock.release();
  }

  public async editPost(id: string, postDelta: Partial<Post>): Promise<void> {
    postDelta.tags = postDelta.tags?.map(tag => tag.toLowerCase());

    await this.postCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        ...postDelta,
        lastModified: new Date()
      }
    })
  }
}
