import { useRouter } from "next/router";
// import useSocketState from "./useSocketState";
import usePreferenceStorage from "./usePreferenceStorage";
import useAppStore from "@/stores/AppStore";
import useUserStore from "@/stores/useUserStore";

function useSessionTokens() {
  const router = useRouter();
  const { setPreference, getPreference, removePreference } =
    usePreferenceStorage();
  // const disconnectSocket = useSocketState.getState().disconnect;

  const addTokens = (accessToken: string, refreshToken: string) => {
    setPreference("X-SIG", refreshToken);
    useAppStore.setState((state) => {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    });
  };

  const getRefreshToken = async () => {
    let refreshToken = "";
    await getPreference("X-SIG").then((token) => {
      refreshToken = token;
    });
    return refreshToken;
  };

  const removeTokens = async () => {
    await removePreference("X-SIG").then(() => {
      useAppStore.setState(useAppStore.getInitialState());
      useUserStore.setState(useUserStore.getInitialState());
      // disconnectSocket();
      router.replace("/auth/signin");
    });
  };

  return { getRefreshToken, addTokens, removeTokens };
}

export default useSessionTokens;
