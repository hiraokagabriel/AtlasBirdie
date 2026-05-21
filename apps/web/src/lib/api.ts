const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3333';

type ApiResponse<T> = {
  data: T;
};

type ApiListResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    const error = (await res.json()) as { error: string; code: string };
    throw new Error(error.error ?? 'Unknown API error');
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<ApiResponse<T>>(path),
  getList: <T>(path: string) => request<ApiListResponse<T>>(path),
  post: <T>(path: string, body: unknown) =>
    request<ApiResponse<T>>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<ApiResponse<T>>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<ApiResponse<T>>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<ApiResponse<T>>(path, { method: 'DELETE' }),
};
