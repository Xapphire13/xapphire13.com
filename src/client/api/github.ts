export type RepoWithPrCount = { repo: GithubRepo; prCount: number };
export type GithubRepo = {
  name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
  };
  stargazers_count: number;
};

export async function getProjects(): Promise<GithubRepo[]> {
  const response = await fetch('/api/github/projects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getContributions(): Promise<RepoWithPrCount[]> {
  const response = await fetch('/api/github/contributions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
