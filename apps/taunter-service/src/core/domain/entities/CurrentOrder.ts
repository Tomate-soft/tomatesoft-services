// current orders
interface OrderProduct {
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface OrderDetail {
  subtotal: number;
  tax: number;
  total: number;
  products: OrderProduct[];
}

export interface CurrentOrder {
  code: string;
  user_name: string;
  user_employee_number: string;
  status: string;
  order_detail: OrderDetail;
  payment_detail: any;
  table_detail: any;
  order_name: string;
  comments: string;
  diner: number;
  billed: boolean;
}
