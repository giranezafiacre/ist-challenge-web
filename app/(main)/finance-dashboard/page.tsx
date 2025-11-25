'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function FinanceDashboard() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/finance/requests/');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'finance') {
      fetchRequests();
    }
  }, [user]);

  if (!user || user.role !== 'finance') {
    return <div>You do not have access to this page.</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Submitted By</th>
            <th className="border px-4 py-2">Proforma</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req: any) => (
            <tr key={req.id}>
              <td className="border px-4 py-2">{req.title}</td>
              <td className="border px-4 py-2">{req.amount}</td>
              <td className="border px-4 py-2">{req.created_by.username}</td>
              <td className="border px-4 py-2">
                {req.proforma ? (
                  <a href={req.proforma} target="_blank" rel="noopener noreferrer">View</a>
                ) : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
