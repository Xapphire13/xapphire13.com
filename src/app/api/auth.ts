export async function getTempToken(password: string): Promise<any> {
  const response = await fetch("/api/auth", {
    method: "POST",
    body: {
      pass: btoa(password)
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
