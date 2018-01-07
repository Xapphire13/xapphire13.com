export interface Post {
  id: string;
  title: string;
  created: Date;
  lastModified: Date;
  markdownText: string;
  tags: string[];
}
