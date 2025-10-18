interface IProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  rating: number;
  inStock: boolean;
  company: string;
  quantity?: number;
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
  model: string;
  platform: string;
  deviceName: string;
  operatingSystem: string;
}

interface IUser {
  id: string;
  dob: string;
  city: string;
  email: string;
  gender: string;
  qrCode: string;
  avatar: string;
  address: string;
  country: string;
  lastName: string;
  verified: boolean;
  firstName: string;
  nextOfKin: string;
  createdAt: string;
  nationalId: string;
  phoneNumber: string;
  countryCode: string;
  nextOfKinNum: string;
  permissions: string[];
}
