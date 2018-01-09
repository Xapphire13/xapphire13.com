import {Post} from "../post";
import {PagedResponse} from "../paged-response";

export function getPosts(continuationToken: string | null = null): Promise<PagedResponse<Post>> {
  return fetch(`/api/posts${continuationToken ? `?continue=${continuationToken}` : ""}`)
    .then(res => res.json());
}

export function getPost(id: string): Promise<Post> {
  return fetch(`/api/posts/${id}`).then(res => res.json());
}
