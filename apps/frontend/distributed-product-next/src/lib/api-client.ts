const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5067";

type ApiClientOptions = RequestInit & {
  auth?: boolean;
};

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data === "string") {
      return data;
    }

    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message;
    }

    if (data?.title) {
      return data.title;
    }

    return `Request failed: ${response.status}`;
  } catch {
    return `Request failed: ${response.status}`;
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt")
  );
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw new Error("Unauthorized: กรุณา Login ใหม่ หรือ Token หมดอายุ");
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}