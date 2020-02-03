export default interface Post {
  _id: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
  markdownText: string;
  tags: string[];
  isPublished: boolean;
}
