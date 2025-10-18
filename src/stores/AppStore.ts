import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AppStore {
  cart: IProduct[];
  orders: IOrder[];
  accessToken: string;
  refreshToken: string;
  wishList: IProduct[];
  products: IProduct[];
  device: IDevice | undefined;
  notications: INotification[];
  showCartConfirmDialog: boolean;
}

const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    cart: [],
    orders: [],
    wishList: [],
    products: [],
    notications: [],
    accessToken: "",
    refreshToken: "",
    device: undefined,
    showCartConfirmDialog: true,
  }))
);

export default useAppStore;
