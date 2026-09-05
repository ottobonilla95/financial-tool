export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body.error === "string"
        ? body.error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
};
