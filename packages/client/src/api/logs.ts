import {AuthManager} from "../auth-manager";
import {Log} from "xapphire13-entities";
import {Page} from "xapphire13-entities";
import {container} from "tsyringe";

export async function getLogs(continuationToken: string | null = null): Promise<Page<Log>> {
  const authManager = container.resolve(AuthManager);
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
