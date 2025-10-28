import { useEffect } from "react";
import { Device } from "@capacitor/device";
import useAppStore from "@/stores/AppStore";
import useAuthSession from "./useAuthSession";
import useUserStore from "@/stores/useUserStore";
import { default as axiosInstance, CreateAxiosDefaults } from "axios";

export const useAxios = () => {
  const { getCookie, signOut, signIn } = useAuthSession();
  const role = useUserStore((state) => state.role ?? "");
  const deviceId = useAppStore((state) => state.deviceId);

  useEffect(() => {
    Device.getId().then((device) => {
      useAppStore.setState((state) => {
        state.deviceId = device.identifier;
      });
    });
  }, []);

  const options: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    headers: {
      "X-Platform": role.includes("supplier") ? "supplier" : "retailer",
      "X-Device-Id": deviceId,
      "Content-Type": "application/json",
    },
  };

  const axios = axiosInstance.create(options);
  const secureAxios = axiosInstance.create(options);

  secureAxios.interceptors.request.use(
    async (config) => {
      const accessToken = useAppStore.getState().accessToken;
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  secureAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        try {
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return secureAxios(prevRequest);
          }
        } catch (refreshError) {
          signOut();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const refreshToken = async () => {
    try {
      const response = await axios.get("/user/refresh", {
        headers: { Authorization: `Bearer ${getCookie()?.value}` },
      });
      useAppStore.setState({ accessToken: response.data.accessToken });
      signIn(async () => response.data.refreshToken);
      return response.data.accessToken;
    } catch (error) {
      signOut();
      throw error;
    }
  };

  return { axios, secureAxios };
};
