"use client"
import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


export default function DashboardPage() {
    const [stats, setStats] = useState<any>({ totals: { pending: 0, approved: 0, rejected: 0 }, timeseries: [] });


    useEffect(() => {
        // your backend should provide a summary endpoint - fallback to requests list
        api.get('/requests/').then(res => {
            const list = res.data;
            const pending = list.filter((r: any) => r.status === 'PENDING').length;
            const approved = list.filter((r: any) => r.status === 'APPROVED').length;
            const rejected = list.filter((r: any) => r.status === 'REJECTED').length;
            setStats({ totals: { pending, approved, rejected }, timeseries: [{ name: 'Requests', pending, approved, rejected }] });
        }).catch(console.error);
    }, []);
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Link href="/requests?status=PENDING">
                    <div className="bg-white p-4 rounded shadow">
                        <div className="text-sm text-gray-500">Pending</div>
                        <div className="text-2xl font-bold">{stats.totals.pending}</div>
                    </div>
                </Link>
                <Link href="/requests?status=APPROVED">
                    <div className="bg-white p-4 rounded shadow">
                        <div className="text-sm text-gray-500">Approved</div>
                        <div className="text-2xl font-bold">{stats.totals.approved}</div>
                    </div>
                </Link>
                <Link href="/requests?status=REJECTED">
                    <div className="bg-white p-4 rounded shadow">
                        <div className="text-sm text-gray-500">Rejected</div>
                        <div className="text-2xl font-bold">{stats.totals.rejected}</div>
                    </div>
                </Link>
            </div>


            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium mb-2">Activity</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={stats.timeseries}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="pending" stroke="#f59e0b" />
                            <Line type="monotone" dataKey="approved" stroke="#10b981" />
                            <Line type="monotone" dataKey="rejected" stroke="#ef4444" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}