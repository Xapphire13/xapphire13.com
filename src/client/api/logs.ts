import {AuthManager} from "../auth-manager";
import {container} from "tsyringe";
import Log = Xapphire13.Entities.Log;
import Page = Xapphire13.Entities.Page;

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
