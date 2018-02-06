import {AuthManager} from "../auth-manager";
import {Container} from "typedi";
import {Log} from "../../models/log";
import {Page} from "../../pagination";

export async function getLogs(continuationToken: string | null = null): Promise<Page<Log>> {
  const authManager = Container.get(AuthManager);
  const response = await fetch(`/api/logs${continuationToken ? `?continue=${continuationToken}` : ""}`, {
    headers: {
      Authorization: `Bearer ${await authManager.authToken}`
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
