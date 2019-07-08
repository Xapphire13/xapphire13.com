export async function getTempToken(username: string, password: string): Promise<{challenge: string, authenticatorUrl: string}> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password: btoa(password)
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getAuthToken(challengeResponse: string, challenge: string): Promise<string> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      challengeResponse,
      challenge
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return (await response.json()).token;
}
