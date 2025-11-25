'use client';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Table from '@/components/Table';


export default function ApprovalsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        api.get('/requests/pending/').then(res => setItems(res.data)).catch(console.error).finally(() => setLoading(false));
        console.log("items pending",items)
    }, []);


    if (loading) return <div>Loading...</div>;


    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Created by</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(r => (
                        <tr key={r.id}>
                            <td>{r.title}</td>
                            <td>{r.amount}</td>
                            <td>{r.created_by}</td>
                            <td>
                                <Link href={`/requests/${r.id}`} className="px-2 py-1 bg-blue-600 text-white rounded">View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}