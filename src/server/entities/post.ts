export default interface Post {
  id?: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
  markdownText: string;
  tags: string[];
  isPublished: boolean;
}