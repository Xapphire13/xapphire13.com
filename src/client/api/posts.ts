import { container } from 'tsyringe';
import { AuthManager } from '../auth-manager';
import Page from ':entities/page';
import Post from ':entities/post';

export async function getPosts(
  continuationToken: string | null = null
): Promise<Page<Post>> {
  const response = await fetch(
    `/api/posts${continuationToken ? `?continue=${continuationToken}` : ''}`
  );

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

export async function createPost(
  title: string,
  markdownText: string,
  tags?: string[]
): Promise<Post> {
  const authManager = container.resolve(AuthManager);
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await authManager.authToken}`
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

export async function savePost(
  id: string,
  title: string,
  markdownText: string,
  tags?: string[]
): Promise<void> {
  const authManager = container.resolve(AuthManager);
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await authManager.authToken}`
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
}

export async function deletePost(id: string): Promise<void> {
  const authManager = container.resolve(AuthManager);
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await authManager.authToken}`
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}
