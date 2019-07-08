export default interface Post {
  id: string;
  title: string;
  created: string;
  lastModified: string;
  markdownText: string;
  tags: string[];
  isPublished: boolean;
}