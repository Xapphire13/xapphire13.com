export async function getTempToken(password: string): Promise<{tempToken: string, authenticatorUrl: string}> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pass: btoa(password)
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
