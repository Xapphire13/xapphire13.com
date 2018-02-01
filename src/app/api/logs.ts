import {Log} from "../../models/log";
import {Page} from "../../pagination";

export async function getLogs(continuationToken: string | null = null): Promise<Page<Log>> {
  const response = await fetch(`/api/logs${continuationToken ? `?continue=${continuationToken}` : ""}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
