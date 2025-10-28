import { create } from "zustand";
import { usePathname } from "next/navigation";
import Router, { useRouter } from "next/router";
import { useEffect, useCallback } from "react";
import { immer } from "zustand/middleware/immer";
import useUserStore from "@/stores/useUserStore";

export const authPages = [
  "/auth/signin",
  "/auth/signup",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const parseCookies = (): Cookie[] => {
  try {
    return decodeURIComponent(document.cookie)
      .split("; ")
      .filter(Boolean) // Filter out empty strings
      .map((cookie) => {
        const [name, ...valueParts] = cookie.split("=");
        return { name, value: valueParts.join("=") };
      });
  } catch (error) {
    console.error("Error parsing cookies:", error);
    return [];
  }
};

// Fetch all cookies excluding the session cookie
const getCookies = (): Cookie[] => {
  const allCookies = parseCookies();
  return allCookies.filter((cookie) => cookie.name !== __SESSION_NAME__);
};

const createCookie = async (value: string, expiry: number) => {
  try {
    const d = new Date();
    d.setTime(d.getTime() + expiry);
    document.cookie = `${__SESSION_NAME__}=${value};expires=${d.toUTCString()};path=/`;
    useAuthStore.setState((state) => {
      state.cookies = getCookies();
      state.status = "authenticated";
    });
    return true;
  } catch (error) {
    console.error("Error creating cookie:", error);
    return false;
  }
};

const deleteCookie = (name: string) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

const getCookie = (cookieName = __SESSION_NAME__): Cookie | undefined => {
  return parseCookies().find((cookie) => cookie.name === cookieName);
};

type Cookie = {
  name: string;
  value: string;
};

const __SESSION_NAME__ = "__AUTH_SIG__";
type Status = "loading" | "authenticated" | "unauthenticated";

type AuthStore = {
  cookies: Cookie[];
  status: Status;
  setCookies: (cookies: Cookie[]) => void;
  setStatus: (status: Status) => void;
  signOut: () => void;
  signIn: (
    cb: () => Promise<string>,
    options?: SignInOptions | undefined
  ) => Promise<void>;
};

const useAuthStore = create<AuthStore>()(
  immer((set, get) => ({
    cookies: [],
    status: "loading",
    setCookies: (cookies) => set({ cookies }),
    setStatus: (status) => set({ status }),
    signOut: () => {
      useUserStore.setState(useUserStore.getInitialState());
      const allCookies = parseCookies();
      allCookies.forEach((cookie) => deleteCookie(cookie.name));
      set({ status: "unauthenticated", cookies: [] });
    },
    signIn: async (cb: () => Promise<string>, options?: SignInOptions) => {
      try {
        const sessionValue = await cb();
        if (sessionValue) {
          await createCookie(
            sessionValue,
            options?.expiry ?? 30 * 24 * 60 * 60 * 1000
          ).then((res) => {
            if (res) Router.replace("/", undefined, { shallow: true });
          });
        } else {
          console.warn("Sign-in callback returned an empty value.");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    },
  }))
);

type SignInOptions = {
  expiry?: number;
  replace?: boolean;
  path?: string;
};

const useAuthSession = () => {
  const router = useRouter();
  const pathName = usePathname();
  const signIn = useAuthStore.getState().signIn;
  const signOut = useAuthStore.getState().signOut;
  const setStatus = useAuthStore.getState().setStatus;
  const status = useAuthStore((state) => state.status);
  const setCookies = useAuthStore.getState().setCookies;
  const cookies = useAuthStore((state) => state.cookies);

  useEffect(() => {
    const sessionCookie = getCookie();
    setStatus(sessionCookie ? "authenticated" : "unauthenticated");
    setCookies(getCookies());
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" && !authPages.includes(pathName)) {
      router.replace("/auth/signin");
    }
  }, [status]);

  return {
    cookies,
    status,
    signIn,
    signOut,
    createCookie,
    getCookie,
  };
};

export default useAuthSession;
