import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { env } from "../config/env";
import { firestore } from "../config/firebase";
import type { CreateOrderPayload, OrderRecord } from "../types/order";

const buildOrderNumber = () => {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `PSJ-${randomPart}`;
};

export const createOrder = async (payload: CreateOrderPayload): Promise<OrderRecord> => {
  if (!firestore || !env.ordersCollection) {
    throw new Error("Siparis kaydi icin Firebase ayarlari eksik.");
  }

  const orderNumber = buildOrderNumber();
  const orderData = {
    orderNumber,
    status: "Hazirlaniyor",
    createdAt: serverTimestamp(),
    customer: payload.customer,
    payment: {
      cardName: payload.payment.cardName,
      cardNumberLast4: payload.payment.cardNumber.slice(-4),
      expireDate: payload.payment.expireDate,
      installment: payload.payment.installment
    },
    items: payload.items,
    subtotal: payload.subtotal,
    shippingCost: payload.shippingCost,
    total: payload.total
  };

  const docRef = await addDoc(collection(firestore, env.ordersCollection), orderData);

  return {
    id: docRef.id,
    orderNumber,
    status: "Hazirlaniyor",
    createdAt: new Date().toISOString(),
    customer: payload.customer,
    payment: {
      cardName: payload.payment.cardName,
      cardNumberLast4: payload.payment.cardNumber.slice(-4),
      expireDate: payload.payment.expireDate,
      installment: payload.payment.installment
    },
    items: payload.items,
    subtotal: payload.subtotal,
    shippingCost: payload.shippingCost,
    total: payload.total
  };
};
