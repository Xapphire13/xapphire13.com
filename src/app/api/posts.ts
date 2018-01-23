import {Post} from "../../models/post";
import {PagedResponse} from "../../paged-response";

export async function getPosts(continuationToken: string | null = null): Promise<PagedResponse<Post>> {
  const response = await fetch(`/api/posts${continuationToken ? `?continue=${continuationToken}` : ""}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function getPost(id: string): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function createPost(title: string, markdownText: string, tags?: string[]): Promise<Post> {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      title,
      markdownText,
      tags
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
