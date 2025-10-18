import { useAxios } from "./useAxios";
import { Device } from "@capacitor/device";
import useAppStore from "@/stores/AppStore";
import { useRouter } from "next/navigation";
import { toast } from "@/components/toast/toast";
import useSessionTokens from "./useSessionTokens";
import { useSocketState } from "./useSocketState";
import useUserStore from "@/stores/useUserStore";
import usePreferenceStorage from "./usePreferenceStorage";
import useNonPersistedStore from "@/stores/useNonPersistedStore";

const useAuth = () => {
  const router = useRouter();
  const { axios, secureAxios } = useAxios();
  const { getPreference } = usePreferenceStorage();
  const { addTokens, removeTokens } = useSessionTokens();
  const deviceID = useAppStore((state) => state.device?.id);
  const connectToServer = useSocketState((state) => state.connect);

  const signup = async (values: any) => {
    try {
      const response = await axios.post("/user/signup", values);
      if (response.data.accessToken)
        addTokens(response.data.accessToken, response.data.refreshToken);
      return response.data.accessToken;
    } catch (error: any) {
      console.log("@@@@@@@@", error);
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
      return "";
    }
  };

  const signin = async (
    values: any,
    setIsLoading?: (value: boolean) => void
  ) => {
    setIsLoading && setIsLoading(true);
    try {
      // const response = await axios.post("/user/signin", values);
      // addTokens(response.data.accessToken, response.data.refreshToken);
      // router.replace("/");
      addTokens(values.licenseNumber, values.password);
      if (values.licenseNumber === "supplier") {
        router.push("/supplier");
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response
          ? error.response.data.message
          : error.message,
        variant: "error",
      });
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  const fetchUser = async (
    setIsFetchingUser: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const socket = useSocketState.getState().socket;
    setIsFetchingUser(true);
    try {
      // const response = await secureAxios.get("/user");
      // console.log("Fetch user: ", response.data);
      // if (!socket?.connected && deviceID)
      //   connectToServer(response.data.user.id, deviceID);
      // useUserStore.setState({ ...response.data.user });
      // useNonPersistedStore.setState({ hasFetchedUser: true });
    } catch (error: any) {
      if (error.response) {
        console.log("Fetch user  error", error);
        signout();
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
    } finally {
      setIsFetchingUser(false);
    }
  };

  const getDeviceInfo = async () => {
    const model = (await Device.getInfo()).model;
    const deviceName = (await Device.getInfo()).name ?? "unknown";
    const deviceId = (await Device.getId()).identifier;
    const platform = (await Device.getInfo()).platform;
    const operatingSystem = (await Device.getInfo()).operatingSystem;

    useAppStore.setState((state) => {
      state.device = {
        model: model,
        id: deviceId,
        platform: platform,
        operatingSystem: operatingSystem,
        deviceName: deviceName || "unknown",
      };
    });
  };

  const getAuthStatus = async (): Promise<boolean> => {
    let isAuthenticated: boolean = false;
    await getPreference("X-SIG").then((refreshToken) => {
      if (refreshToken) {
        isAuthenticated = true;
      } else {
        isAuthenticated = false;
      }
    });
    return isAuthenticated;
  };

  const signout = async (setIsLoading?: (value: boolean) => void) => {
    if (setIsLoading) setIsLoading(true);
    try {
      // await secureAxios.post("/user/signout");
    } catch (error: any) {
      console.log(error);
    } finally {
      if (setIsLoading) setIsLoading(false);
      await removeTokens();
    }
  };

  return {
    signout,
    signin,
    signup,
    getAuthStatus,
    fetchUser,
    getDeviceInfo,
  };
};

export default useAuth;
