// Use environment variable with fallback to local development server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'worker' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  role?: 'user' | 'worker' | 'admin';
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await handleResponse(response);
    this.setAuthToken(data.token);
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await handleResponse(response);
    this.setAuthToken(data.token);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Token management
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      // Also set as a cookie for server-side auth
      document.cookie = `token=${token}; path=/; max-age=86400; samesite=lax`;
    }
  },

  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // First try to get from cookies (for server-side)
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      // Fall back to localStorage (for client-side)
      return cookieValue || localStorage.getItem('token');
    }
    return null;
  },

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // Also remove the cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  },
};
