const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type RequestOptions = {
  token?: string
  revalidate?: number
}

async function request<T>(path: string, init?: RequestInit, options?: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error', code: 'UNKNOWN' }))
    throw Object.assign(new Error(err.error ?? 'Request failed'), { code: err.code, status: res.status })
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'GET' }, options),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, options),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'DELETE' }, options),
}
