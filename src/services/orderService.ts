import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore";
import { env } from "../config/env";
import { firestore } from "../config/firebase";
import type { CreateOrderPayload, OrderRecord } from "../types/order";

const orderStatuses = ["Hazırlanıyor", "Kargoda", "Teslim Edildi", "İptal Edildi"] as const;

const buildOrderNumber = () => {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `PSJ-${randomPart}`;
};

const mapOrder = (snapshot: QueryDocumentSnapshot<DocumentData>): OrderRecord => {
  const data = snapshot.data();
  const createdAtValue = data.createdAt;
  const createdAt =
    createdAtValue && typeof createdAtValue.toDate === "function"
      ? createdAtValue.toDate().toISOString()
      : new Date().toISOString();

  return {
    id: snapshot.id,
    userId: typeof data.userId === "string" ? data.userId : undefined,
    userEmail: typeof data.userEmail === "string" ? data.userEmail : undefined,
    orderNumber: typeof data.orderNumber === "string" ? data.orderNumber : snapshot.id,
    status:
      typeof data.status === "string" && orderStatuses.includes(data.status as never)
        ? data.status
        : "Hazırlanıyor",
    createdAt,
    customer: {
      fullName: data.customer?.fullName ?? "",
      phone: data.customer?.phone ?? "",
      city: data.customer?.city ?? "",
      district: data.customer?.district ?? "",
      address: data.customer?.address ?? ""
    },
    payment: {
      cardName: data.payment?.cardName ?? "",
      cardNumberLast4: data.payment?.cardNumberLast4 ?? "",
      expireDate: data.payment?.expireDate ?? "",
      installment: data.payment?.installment ?? ""
    },
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: typeof data.subtotal === "number" ? data.subtotal : 0,
    shippingCost: typeof data.shippingCost === "number" ? data.shippingCost : 0,
    total: typeof data.total === "number" ? data.total : 0
  };
};

export const createOrder = async (payload: CreateOrderPayload): Promise<OrderRecord> => {
  if (!firestore || !env.ordersCollection) {
    throw new Error("Sipariş kaydı için Firebase ayarları eksik.");
  }

  const orderNumber = buildOrderNumber();
  const orderData = {
    userId: payload.userId,
    userEmail: payload.userEmail,
    orderNumber,
    status: "Hazırlanıyor",
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
    userId: payload.userId,
    userEmail: payload.userEmail,
    orderNumber,
    status: "Hazırlanıyor",
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

export const getAllOrders = async (): Promise<OrderRecord[]> => {
  if (!firestore || !env.ordersCollection) {
    throw new Error("Sipariş verisi şu anda yüklenemiyor.");
  }

  const snapshot = await getDocs(
    query(collection(firestore, env.ordersCollection), orderBy("createdAt", "desc"))
  );

  return snapshot.docs.map(mapOrder);
};

export const updateOrderStatus = async (orderId: string, status: OrderRecord["status"]) => {
  if (!firestore || !env.ordersCollection) {
    throw new Error("Sipariş durumu güncellenemedi.");
  }

  await updateDoc(doc(collection(firestore, env.ordersCollection), orderId), {
    status,
    updatedAt: serverTimestamp()
  });
};

