const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';

export function apiUrl(path: string) {
  return `${apiBase}${path}`;
}

export async function apiFetch(input: string, init?: RequestInit) {
  return fetch(apiUrl(input), init);
}
