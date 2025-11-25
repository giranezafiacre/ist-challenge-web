'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import api from '@/lib/api';


export default function RequestDetailPage() {
    const router = useRouter();
    // in App Router useParams inside component
    const params = (typeof window !== 'undefined') ? new URLSearchParams(window.location.pathname) : null;
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);


    const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null;


    useEffect(() => {
        if (!id) return;
        api.get(`/requests/${id}/`).then(res => setRequest(res.data)).catch(console.error).finally(() => setLoading(false));
    }, [id]);


    const handleAction = async (type: 'approve' | 'reject') => {
        try {
            const path = type === 'approve' ? 'approve' : 'reject';
            await api.patch(`/requests/${id}/${path}/`, { comment: type === 'reject' ? 'Rejected via UI' : '' });
            // reload
            const res = await api.get(`/requests/${id}/`);
            setRequest(res.data);
            setConfirmOpen(false);
        } catch (err) {
            console.error(err);
            alert('Action failed');
        }
    };


    if (loading) return <div>Loading...</div>;
    if (!request) return <div>Not found</div>;
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Request — {request.title}</h2>
            <div className="bg-white p-4 rounded shadow">
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Amount:</strong> {request.amount}</p>
                <p className="mt-2">{request.description}</p>


                <h3 className="mt-4 font-medium">Items</h3>
                <ul className="mt-2 space-y-1">
                    {request.items?.map((it: any) => (
                        <li key={it.id} className="flex justify-between">
                            <span>{it.name} x{it.qty}</span>
                            <span>{(it.qty * it.unit_price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>


                <div className="mt-4 flex gap-2">
                    <button onClick={() => { setActionType('approve'); setConfirmOpen(true); }} className="px-3 py-1 bg-green-600 text-white rounded" disabled={request.status !== 'PENDING'}>Approve</button>
                    <button onClick={() => { setActionType('reject'); setConfirmOpen(true); }} className="px-3 py-1 bg-red-600 text-white rounded" disabled={request.status !== 'PENDING'}>Reject</button>
                    <button onClick={() => router.push(`/requests/${id}/receipt`)} className="px-3 py-1 bg-gray-200 rounded">Upload Receipt</button>
                </div>
            </div>


            <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={actionType === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}>
                <p>Are you sure?</p>
                <div className="mt-4 flex gap-2 justify-end">
                    <button onClick={() => setConfirmOpen(false)} className="px-3 py-1 rounded border">Cancel</button>
                    <button onClick={() => handleAction(actionType!)} className="px-3 py-1 rounded bg-blue-600 text-white">Yes</button>
                </div>
            </Modal>
        </div>
    );
}