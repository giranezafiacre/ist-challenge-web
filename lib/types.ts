export interface PurchaseRequest {
  id: number;
  title: string;
  description: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  created_by: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
  proforma?: string;
  proforma_data?: any;
  purchase_order?: string;
  purchase_order_data?: any;
  receipt?: string;
  receipt_validation?: any;
  items: RequestItem[];
  approvals: Approval[];
}

export interface RequestItem {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  unit_price: string;
  total_price?: string;
}

export interface Approval {
  id: number;
  level: number;
  action: 'approved' | 'rejected';
  comment: string;
  approver: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
}

export interface CreateRequestData {
  title: string;
  description: string;
  amount: number;
  items?: RequestItem[];
  proforma?: File;
}