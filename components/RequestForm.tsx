'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { tr } from 'framer-motion/client';

interface Item {
    name: string;
    qty: number;
    unit_price: number;
}

export default function RequestForm({ onCreated }: { onCreated?: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [items, setItems] = useState<Item[]>([{ name: '', qty: 1, unit_price: 0 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const form = new FormData();
            form.append('title', title);
            form.append('description', description);

            if (file) {
                form.append('proforma', file);
            }
            form.append('items', JSON.stringify(
                items.map(item => ({
                    name: item.name,
                    qty: Number(item.qty),
                    unit_price: Number(item.unit_price)
                }))
            ));
            console.log("Submitting items:", form.get('items'));
            await api.post('/requests/',
                form,
                {
                    headers:
                        { 'Content-Type': 'multipart/form-data' }
                });

            // Reset form
            setTitle('');
            setDescription('');
            setFile(null);

            onCreated?.();
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };
    const updateItem = (index: number, field: keyof Item, value: string) => {
        const newItems = [...items];
        if (field === 'name') {
            newItems[index][field] = value;
        } else {
            const num = parseFloat(value)
            if (isNaN(num) == true) {
                newItems[index][field] = 0
            } else {
                newItems[index][field] = num
            }
        }

        console.log("updated item:", newItems[index])
        setItems(newItems);
        console.log("all items:", items)
    }
    useEffect(() => {
        console.log('Items updated:', items);
    }, [items]);
    const addItem = () => setItems([...items, { name: '', qty: 1, unit_price: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    return (
        <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-4">
            {error && <div className="text-red-600">{error}</div>}

            <label className="block">
                Title
                <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border w-full p-2 rounded"
                />
            </label>

            <label className="block">
                Description
                <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border w-full p-2 rounded"
                />
            </label>

            <label className="block">
                Proforma (optional)
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full" />
            </label>

            <div className="space-y-2">
                <h4 className="font-semibold">Items</h4>
                {items.map((item, index) => (
                    <div key={index} className="flex flex-wrap gap-2 items-end">
                        <div className="flex-1 flex-col">
                            <label htmlFor="name">Item Name: </label>

                            <input
                                required
                                placeholder="Item Name"
                                name='name'
                                value={item.name}
                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                className="border p-2 rounded flex-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="qty">Qty: </label>

                            <input
                                required
                                type="number"
                                placeholder="Qty"
                                value={item.qty}
                                onChange={(e) => updateItem(index, 'qty', e.target.value)}
                                className="border p-2 rounded w-20"
                            />
                        </div>
                        <div>
                            <label htmlFor="unit_price">Unit Price: </label>
                            <input
                                required
                                type="number"
                                placeholder="Unit Price"
                                value={item.unit_price}
                                onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                className="border p-2 rounded w-28"
                            />
                        </div>
                        {items.length > 1 && (
                            <button type="button" onClick={() => removeItem(index)} className="text-red-600 px-2">
                                ✕
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addItem} className="text-blue-600 mt-2">
                    + Add Item
                </button>
            </div>

            <div className="flex gap-2">
                <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setTitle('');
                        setDescription('');

                        setFile(null);
                        setItems([{ name: '', qty: 1, unit_price: 0 }]);
                    }}
                    className="px-4 py-2 border rounded"
                >
                    Reset
                </button>
            </div>
        </form>
    );
};
