"use client";
import api from '@/lib/api';
import { useRef, useState } from 'react';



export default function ReceiptUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const id = typeof window !== 'undefined' ? window.location.pathname.split('/').slice(-2)[0] : null;
    const inputRef = useRef<HTMLInputElement | null>(null);


    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) setFile(f);
    };


    const onUpload = async () => {
        if (!file || !id) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('receipt', file);
        try {
            await api.post(`/requests/${id}/submit-receipt/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Uploaded');
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Upload Receipt</h2>
            <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-dashed border-2 border-gray-300 rounded p-8 text-center"
            >
                <p>Drag & drop a file here, or</p>
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded" onClick={() => inputRef.current?.click()}>Choose file</button>
                <input ref={inputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />


                {file && (
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setFile(null)} className="px-3 py-1 border rounded">Remove</button>
                            <button onClick={onUpload} disabled={uploading} className="px-3 py-1 bg-green-600 text-white rounded">{uploading ? 'Uploading...' : 'Upload'}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}