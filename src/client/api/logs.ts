import { container } from 'tsyringe';
import AuthManager from '../auth-manager';
import Log from ':entities/log';
import Page from ':entities/page';

export default async function getLogs(
  continuationToken: string | null = null
): Promise<Page<Log>> {
  const authManager = container.resolve(AuthManager);
  const response = await fetch(
    `/api/logs${continuationToken ? `?continue=${continuationToken}` : ''}`,
    {
      headers: {
        Authorization: `Bearer ${await authManager.authToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
