export const customFetch = async <T>(
  url: string,
  config?: RequestInit,
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

  const hasBody = config?.body !== undefined;

  const response = await fetch(`${baseUrl}${url}`, {
    ...config,
    credentials: 'include',
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...config?.headers,
    },
  });

  const data = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    throw Object.assign(new Error(data?.message || response.statusText), {
      status: response.status,
      data,
    });
  }

  // Orval's generated types expect the wrapped response shape
  // `{ data, status, headers }`, so every consumer reads `response.data`.
  // Return that shape here instead of the raw body.
  return { data, status: response.status, headers: response.headers } as T;
};

export default customFetch;
