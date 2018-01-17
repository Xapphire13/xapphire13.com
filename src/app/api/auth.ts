export async function getTempToken(username: string, password: string): Promise<{tempToken: string, authenticatorUrl: string}> {
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

export async function getAuthToken(authCode: string, tempToken: string): Promise<string> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      authCode,
      tempToken
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
