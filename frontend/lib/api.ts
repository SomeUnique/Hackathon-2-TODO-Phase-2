'use client';
import { authClient } from "./auth-client";


// API client for handling authenticated requests
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: "include",
    };

    // Add auth token if available


    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - maybe redirect to login
        throw new Error('Unauthorized. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  async signIn(credentials: { email: string; password: string }) {
    return authClient.signIn.email(credentials);
  }

async signUp(credentials: { email: string; password: string; name: string }) { 
  return authClient.signUp.email(credentials);}
  async signOut() {
    return authClient.signOut();
  }

  // Task methods
  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(task: any) { 
  return this.request("/tasks/", { // Yahan aakhir mein '/' check karein
    method: "POST", 
    body: JSON.stringify(task) 
  }); 
}

  async updateTask(id: string, updates: Partial<{ title: string; description?: string; completed: boolean }>) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: number) {
    return this.request(`/tasks/${taskId}`, {
      method: "DELETE",
  });
}
}

export const apiClient = new ApiClient();
export const useSession = authClient.useSession;