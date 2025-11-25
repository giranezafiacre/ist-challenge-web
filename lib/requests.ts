import api from './api';
import { PurchaseRequest, CreateRequestData } from './types';

export const requestsService = {
  async getAll(params?: any): Promise<{ results: PurchaseRequest[]; count: number }> {
    const response = await api.get('/requests/', { params });
    return response.data;
  },

  async getById(id: number): Promise<PurchaseRequest> {
    const response = await api.get(`/requests/${id}/`);
    return response.data;
  },

  async create(data: CreateRequestData): Promise<PurchaseRequest> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('amount', data.amount.toString());

    if (data.items) {
      formData.append('items', JSON.stringify(data.items));
    }

    if (data.proforma) {
      formData.append('proforma', data.proforma);
    }

    const response = await api.post('/requests/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: number, data: Partial<CreateRequestData>): Promise<PurchaseRequest> {
    const response = await api.put(`/requests/${id}/`, data);
    return response.data;
  },

  async approve(id: number, comment: string): Promise<PurchaseRequest> {
    const response = await api.patch(`/requests/${id}/approve/`, {
      action: 'approve',
      comment,
    });
    return response.data;
  },

  async reject(id: number, comment: string): Promise<PurchaseRequest> {
    const response = await api.patch(`/requests/${id}/reject/`, {
      action: 'reject',
      comment,
    });
    return response.data;
  },

  async submitReceipt(id: number, receipt: File): Promise<PurchaseRequest> {
    const formData = new FormData();
    formData.append('receipt', receipt);

    const response = await api.post(`/requests/${id}/submit-receipt/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};