'use client';
import React from 'react';


export default function Table({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full table-auto text-left">
                {children}
            </table>
        </div>
    );
}