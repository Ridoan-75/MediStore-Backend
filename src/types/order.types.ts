export interface CreateOrderInput {
  phone: string;
  shippingAddress: string;
  orderItems: OrderItemInput[];
}

export interface OrderItemInput {
  medicineId: string;
  quantity: number;
}