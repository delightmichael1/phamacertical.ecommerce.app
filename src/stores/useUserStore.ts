import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const useUserStore = create<IUser>()(
  persist(
    immer((set, get) => ({
      id: "",
      dob: "",
      role: "",
      email: "",
      rating: 0,
      qrCode: "",
      gender: "",
      avatar: "",
      address: "",
      country: "",
      lastName: "",
      createdAt: "",
      firstName: "",
      nextOfKin: "",
      nationalId: "",
      verified: false,
      countryCode: "",
      phoneNumber: "",
      permissions: [],
      nextOfKinNum: "",
      city: "undefined",
      currentLocation: undefined,
    })),
    { name: "user-storage" }
  )
);

export default useUserStore;
