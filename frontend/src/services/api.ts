const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface RequestOptions {
  method?: string;
  body?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: { username, password },
    }),

  register: (data: { username: string; password: string; email: string; fullName: string }) =>
    request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: data,
    }),

  me: () => request<any>("/auth/me"),
};

// Project API
export const projectApi = {
  list: () => request<any[]>("/projects"),

  get: (id: string) => request<any>(`/projects/${id}`),

  create: (data: any) => request<any>("/projects", { method: "POST", body: data }),

  update: (id: string, data: any) => request<any>(`/projects/${id}`, { method: "PUT", body: data }),

  delete: (id: string) => request<any>(`/projects/${id}`, { method: "DELETE" }),
};

// Task API
export const taskApi = {
  listByProject: (projectId: string) => request<any[]>(`/tasks/project/${projectId}`),

  get: (id: string) => request<any>(`/tasks/${id}`),

  create: (data: any) => request<any>("/tasks", { method: "POST", body: data }),

  update: (id: string, data: any) => request<any>(`/tasks/${id}`, { method: "PUT", body: data }),

  delete: (id: string) => request<any>(`/tasks/${id}`, { method: "DELETE" }),

  batchUpdateStatus: (tasks: { id: string; status: string; orderIndex: number }[]) =>
    request<any>("/tasks/batch-status", { method: "POST", body: { tasks } }),
};

// Sprint API
export const sprintApi = {
  listByProject: (projectId: string) => request<any[]>(`/sprints/project/${projectId}`),

  create: (data: any) => request<any>("/sprints", { method: "POST", body: data }),

  update: (id: string, data: any) => request<any>(`/sprints/${id}`, { method: "PUT", body: data }),
};
