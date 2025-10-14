import useAppStore from "@/stores/AppStore";
import useSessionTokens from "./useSessionTokens";
import { default as axiosInstance, CreateAxiosDefaults } from "axios";

export const useAxios = () => {
  const device = useAppStore((state) => state.device);
  const { addTokens, getRefreshToken, removeTokens } = useSessionTokens();

  const options: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    headers: {
      "X-Platform": "admin",
      "X-Device-Id": device?.id,
      "X-Device-Model": device?.model,
      "X-Device-OS": device?.operatingSystem,
      "X-Device-Name": device?.deviceName,
      "X-Device-Platform": device?.platform,
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
          removeTokens();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const refreshToken = async () => {
    try {
      let aToken = useAppStore.getState().accessToken;
      await getRefreshToken().then(async (rToken) => {
        const response = await axios.get("/user/refresh", {
          headers: { Authorization: `Bearer ${rToken}` },
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        addTokens(accessToken, newRefreshToken);
        aToken = accessToken;
      });
      return aToken;
    } catch (error) {
      removeTokens();
      throw error;
    }
  };

  return { axios, secureAxios };
};
