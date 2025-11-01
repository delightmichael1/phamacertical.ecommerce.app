import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useUserStore = create<IUser>()(
  immer(
    () =>
      ({
        id: "",
        city: "",
        role: "",
        email: "",
        phone: "",
        logo: "",
        address: "",
        branchName: "",
        license: "",
        verified: false,
        companyName: "",
        emailStatus: "",
        administrator: "",
        licenseNumber: "",
        licenseStatus: "pending",
      } as IUser)
  )
);

export default useUserStore;
