export interface CreateOrderDto {
  order_id: string;
  code: string;
  user_name: string;
  user_employee_number: string;
  status: string;
  order_detail: any;
  payment_detail: any;
  table_detail: string;
  order_name: string;
  comments: string;
  diner: number;
}
