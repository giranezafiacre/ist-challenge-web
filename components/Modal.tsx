'use client';
import React from 'react';


export default function Modal({ open, onClose, title, children }: { open: boolean, onClose: () => void, title?: string, children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded p-4 w-96">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{title}</h3>
                    <button onClick={onClose}>Close</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}