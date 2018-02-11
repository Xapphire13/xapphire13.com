export type GithubRepo = {
  name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
  };
};

export async function getProjects(): Promise<GithubRepo[]> {
  const response = await fetch("/api/github/projects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getContributions(): Promise<GithubRepo[]> {
  const response = await fetch("/api/github/contributions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
