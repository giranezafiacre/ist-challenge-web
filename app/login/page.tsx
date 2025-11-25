'use client';

import { useState } from 'react';
import { authService } from '@/lib/auth';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
  setErrorMsg('');
  setLoading(true);
  try {
    const user = await authService.login({
      username: form.username,
      password: form.password
    });

    console.log("Logged in user:", user.role);

    if (user) {
      setUser(user);

      // Redirect based on role
      switch(user.role) {
        case 'finance':
          router.push('/finance-dashboard');
          break;
        case 'approver-level-1':
        case 'approver-level-2':
          router.push('/approvals');
          break;
        case 'staff':
        default:
          router.push('/dashboard');
      }
    }
  } catch (err: any) {
    console.error(err);
    setErrorMsg(err.message || 'Login failed.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 bg-white p-6 shadow rounded-lg">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-3">
            {errorMsg}
          </div>
        )}
        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
