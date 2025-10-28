interface IProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  supplier: string;
  quantity: number;
  description: string;
  expiryDate: string;
  isDeleted: boolean;
}

interface IOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: IOrderItem[];
  total: number;
  subtotal: number;
  tax?: number;
  shipping?: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: "credit card" | "debit card" | "paypal" | "cash on delivery";
  paymentStatus?: "paid" | "unpaid" | "refunded";
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
  discount?: number;
}

interface IBlogPost {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  comments: number;
  hits: number;
  image: string;
  excerpt: string;
}

interface INotification {
  id: string;
}

interface IDevice {
  id: string;
}

interface IUser {
  id: string;
  city: string;
  role: string;
  email: string;
  phone: string;
  logo?: string;
  address: string;
  fullname: string;
  license?: string;
  verified: boolean;
  companyName: string;
  emailStatus: string;
  administrator: string;
  licenseNumber?: string;
  licenseStatus?: "pending" | "approved" | "rejected";
}
