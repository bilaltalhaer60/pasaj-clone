export interface OrderCustomer {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
}

export interface OrderPayment {
  cardName: string;
  cardNumberLast4: string;
  expireDate: string;
  installment: string;
}

export interface OrderLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  customer: OrderCustomer;
  payment: OrderPayment;
  items: OrderLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface CreateOrderPayload {
  customer: OrderCustomer;
  payment: {
    cardName: string;
    cardNumber: string;
    expireDate: string;
    installment: string;
  };
  items: OrderLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

