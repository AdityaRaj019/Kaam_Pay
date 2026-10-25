export interface OrderPricing {
  currency: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  platformFeePercent: number;
  platformFee: number;
  total: number;
}

export interface OrderItem {
  id: string;
  clientId: string;
  freelancerId: string;
  gigId: string;
  unitPrice: number | null;
  quantity: number;
  subtotal: number | null;
  platformFee: number | null;
  amount: number;
  status:
    | 'PENDING'
    | 'PAYMENT_PENDING'
    | 'PAID'
    | 'IN_PROGRESS'
    | 'SUBMITTED'
    | 'REVISION'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'PAYMENT_FAILED'
    | 'DISPUTED';
  idempotencyKey: string | null;
  createdAt: string;
  updatedAt: string;
  gig: {
    id: string;
    title: string;
    category: string;
    deliveryTime: number;
    images: string[];
  };
  freelancer: {
    id: string;
    name: string;
    image: string | null;
  };
  payment?: {
    id: string;
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    platformFee: number;
    escrowStatus: 'HELD' | 'RELEASED' | 'REFUNDED';
    createdAt: string;
  } | null;
}

export interface InitiateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: OrderItem;
    pricing: OrderPricing;
    isExisting: boolean;
  };
}

export interface GetOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: OrderItem;
    pricing: OrderPricing;
  };
}

export interface CreateRazorpayOrderResponse {
  success: boolean;
  message: string;
  data: {
    razorpayOrderId: string;
    amount: number;
    currency: string;
    kaampayOrderId: string;
    keyId: string;
    customer: {
      name: string;
      email: string;
    };
  };
}

export interface VerifyRazorpayPaymentResponse {
  success: boolean;
  message: string;
  data: {
    order: OrderItem;
    pricing: OrderPricing;
    payment: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      escrowStatus: 'HELD' | 'RELEASED' | 'REFUNDED';
    };
  };
}

