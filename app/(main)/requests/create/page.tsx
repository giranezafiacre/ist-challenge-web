'use client';


import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { Table } from 'lucide-react';

const ItemSchema = z.object({
    name: z.string().min(1, 'Name required'),
    qty: z.number().min(1, 'Qty >= 1'),
    unit_price: z.number().min(0, 'Price >= 0'),
});


const FormSchema = z.object({
    title: z.string().min(3, 'Title too short'),
    description: z.string().optional(),
    items: z.array(ItemSchema).min(1, 'Add at least one item'),
});

type FormValues = z.infer<typeof FormSchema>;


export default function CreateRequestPage() {
    const [submitting, setSubmitting] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: { title: '', description: '', items: [{ name: '', qty: 1, unit_price: 0 }] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });


    const items = watch('items') || [];
    const total = items.reduce((s, it) => s + (Number(it.qty) * Number(it.unit_price || 0)), 0);


    const onSubmit = async (data: FormValues) => {
        setSubmitting(true);
        try {
            // convert numbers properly
            const payload = {
                ...data,
                amount: total,
                items: JSON.stringify(data.items.map(it => ({
                    name: it.name,
                    qty: Number(it.qty),
                    unit_price: Number(it.unit_price),
                })))
            };

            await api.post('/requests/', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setSuccessOpen(true);
        } catch (err) {
            console.error(err);
            alert('Failed to create request');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Create Request</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input {...register('title')} className="mt-1 block w-full p-2 border rounded" />
                    {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>


                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea {...register('description')} className="mt-1 block w-full p-2 border rounded" />
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Items</h3>
                        <button type="button" onClick={() => append({ name: '', qty: 1, unit_price: 0 })} className="px-3 py-1 bg-green-600 text-white rounded">Add Item</button>
                    </div>


                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Qty</th>
                                <th>Unit price</th>
                                <th>Total</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((f, idx) => (
                                <tr key={f.id} className="align-middle">
                                    <td>
                                        <input {...register(`items.${idx}.name` as const)} className="p-1 border rounded w-56" />
                                    </td>
                                    <td>
                                        <input type="number" {...register(`items.${idx}.qty` as const, { valueAsNumber: true })} className="p-1 border rounded w-20" />
                                    </td>
                                    <td>
                                        <input type="number" step="0.01" {...register(`items.${idx}.unit_price` as const, { valueAsNumber: true })} className="p-1 border rounded w-32" />
                                    </td>
                                    <td className="text-right">{(Number(items[idx]?.qty || 0) * Number(items[idx]?.unit_price || 0)).toFixed(2)}</td>
                                    <td>
                                        <button type="button" onClick={() => remove(idx)} className="text-red-600">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {errors.items && <p className="text-sm text-red-600">{String(errors.items?.message)}</p>}
                </div>


                <div className="text-right">
                    <div className="mb-2">Grand Total: <strong>{total.toFixed(2)}</strong></div>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
                        {submitting ? 'Creating...' : 'Create Request'}
                    </button>
                </div>
            </form>


            <Modal open={successOpen} onClose={() => setSuccessOpen(false)} title="Created">
                <p>Request created successfully.</p>
            </Modal>
        </div>
    );
}