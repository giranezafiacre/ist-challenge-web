import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'staff' | 'approver-level-1' | 'approver-level-2' | 'finance';
  first_name: string;
  last_name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/token/', credentials);
      console.log('Auth response:', response.data);
      const { token } = response.data;

      localStorage.setItem('access_token', token);

      // Get user info
      const userResponse = await api.get('/users/me/', {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      const user = userResponse.data;
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (err: any) {
      console.error("Login error:", err);

      // Extract readable error
      if (err.response) {
        // Backend returned error
        throw new Error(
          err.response.data?.detail ||
          err.response.data?.error ||
          'Invalid username or password'
        );
      } else if (err.request) {
        // Network issue
        throw new Error('Unable to reach the server. Check your network.');
      } else {
        // Unknown error
        throw new Error('An unexpected error occurred.');
      }
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
