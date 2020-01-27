import { ObjectId } from "mongodb";

export default interface Post {
  _id: ObjectId;
  title: string;
  createdAt: Date;
  lastModified: Date;
  markdownText: string;
  tags: string[];
  isPublished: boolean;
}