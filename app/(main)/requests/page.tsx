"use client";
import RequestCard from "@/components/RequestCard";
import RequestForm from "@/components/RequestForm";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    // Current status filter from URL
    const status = searchParams.get("status") || "ALL";

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get("/requests/");
            setRequests(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // -----------------------------
    // 💡 Combined Filtering Logic
    // -----------------------------
    const filteredRequests = requests.filter((r) => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "ALL" ? true : r.status === status;
        return matchesSearch && matchesStatus;
    });

    // -----------------------------
    // 💡 Update URL for Status filter
    // -----------------------------
    const handleStatusChange = (newStatus: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newStatus === "ALL") params.delete("status");
        else params.set("status", newStatus);

        router.push(`/requests?${params.toString()}`);
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Requests</h2>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 mb-4">
                    {/* Status Filters */}
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`px-3 py-1 rounded border transition ${
                                status === s
                                    ? "bg-blue-600 text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            {s}
                        </button>
                    ))}

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="ml-auto px-3 py-1 border rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid gap-4">
                        {filteredRequests.length === 0 && (
                            <div className="text-gray-500">No requests found</div>
                        )}
                        {filteredRequests.map((r) => (
                            <RequestCard key={r.id} r={r} />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Create Request</h3>
                <RequestForm onCreated={load} />
            </div>
        </div>
    );
}
