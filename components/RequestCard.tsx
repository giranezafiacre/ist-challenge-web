import Link from 'next/link'


export default function RequestCard({ r }: { r: any }) {
    return (
        <div className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="text-sm text-gray-600">{r.description}</p>
                </div>
                <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs ${r.status === 'PENDING' ? 'bg-yellow-100' : r.status === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'}`}>{r.status}</div>
                    <div className="text-sm">${r.amount}</div>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
                <small className="text-xs text-gray-500">by {r.created_by}</small>
                <Link href={`/requests/${r.id}`}><span className="text-sm text-blue-600">View</span></Link>
            </div>
        </div>
    )
}