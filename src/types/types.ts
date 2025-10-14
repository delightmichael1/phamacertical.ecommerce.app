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
