import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AppStore {
  users: IUser[];
  deviceId: string;
  accessToken: string;
  products: IProduct[];
  notications: INotification[];
  showCartConfirmDialog: boolean;
  selectedProduct: IProduct | undefined;
}

const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    users: [],
    deviceId: "",
    products: [],
    notications: [],
    accessToken: "",
    selectedProduct: undefined,
    showCartConfirmDialog: true,
  }))
);

export default useAppStore;
