import Preloader from "./Preloader";
import { toast } from "./toast/toast";
import React, { useEffect } from "react";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import useUserStore from "@/stores/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import useAuthSession, { authPages } from "@/hooks/useAuthSession";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();
  const { secureAxios } = useAxios();
  const { status, signOut } = useAuthSession();
  const { id, role, licenseStatus } = useUserStore();
  const deviceId = useAppStore((state) => state.deviceId);

  useEffect(() => {
    if (status == "authenticated" && !id && deviceId) {
      (async () => {
        try {
          const response = await secureAxios.get("/user");
          useUserStore.setState({ ...response.data });
        } catch (error: any) {
          if (error.response) {
            signOut();
            useAppStore.setState({ accessToken: "" });
            toast({
              title: "Error",
              description: error.response.data.message,
              variant: "error",
            });
          } else {
            toast({
              title: "Error",
              description: error.message,
              variant: "error",
            });
          }
        }
      })();
    }
  }, [status, id, deviceId]);

  if (!id && !authPages.includes(pathName)) {
    return <Preloader isFullHeight />;
  }

  if (status === "authenticated" && !authPages.includes(pathName)) {
    if (role && role.includes("platform-super-admin")) {
      !pathName.includes("admin") && router.push("/admin");
    } else if (licenseStatus === "pending") {
      pathName !== "/waiting" && router.push("/waiting");
    } else if (licenseStatus === "rejected") {
      pathName !== "/rejected" && router.push("/rejected");
    } else if (role && role.includes("supplier")) {
      !pathName.includes("supplier") && router.push("/supplier");
    } else if (role && role.includes("retailer")) {
      !pathName.includes("shop") && router.push("/shop");
    } else {
      return <Preloader isFullHeight />;
    }
  }

  return <>{children}</>;
}

export default AuthProvider;
