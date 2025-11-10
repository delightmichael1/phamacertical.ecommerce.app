import Head from "next/head";
import "@/styles/globals.css";
import Script from "next/script";
import Lottie from "lottie-react";
import type { AppProps } from "next/app";
import SideBar from "@/components/SideBar";
import Toast from "@/components/toast/toast";
import React, { useEffect, useState } from "react";
import AuthProvider from "@/components/AuthProvider";
import { ModalProvider } from "@/components/modals/Modal";
import Security from "../../public/lottie/cybersecurity.json";

export default function App({ Component, pageProps }: AppProps) {
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    const handleSetHeight = () => {
      setPageWidth(window.innerWidth);
    };
    handleSetHeight();

    window.addEventListener("resize", handleSetHeight);
    return () => {
      window.removeEventListener("resize", handleSetHeight);
    };
  }, []);

  if (pageWidth < 768) {
    return (
      <main className="w-full h-screen font-poppins text-xs">
        <Head>
          <title>PharmNex</title>
          <meta
            name="description"
            content="PhamNex is your trusted online pharmacy, offering a wide range of healthcare products and medications with fast delivery and expert advice."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <AuthProvider>
          <ModalProvider>
            <div
              id="main"
              className="flex flex-col justify-center items-center space-y-10 w-full h-full overflow-x-hidden overflow-y-auto"
            >
              <Lottie
                animationData={Security}
                loop={true}
                className="w-full max-w-60 h-fit"
              />
              <span className="max-w-xl font-semibold text-primary text-xl text-center">
                This application is best viewed on desktop.
              </span>
            </div>
            <Toast />
          </ModalProvider>
        </AuthProvider>
        <SideBar />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" />
      </main>
    );
  }

  return (
    <main className="w-full font-poppins text-xs">
      <Head>
        <title>PharmNex</title>
        <meta
          name="description"
          content="PhamNex is your trusted online pharmacy, offering a wide range of healthcare products and medications with fast delivery and expert advice."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <AuthProvider>
        <ModalProvider>
          <div
            id="main"
            className="w-full h-full overflow-x-hidden overflow-y-auto"
          >
            <Component {...pageProps} />
          </div>
          <Toast />
        </ModalProvider>
      </AuthProvider>
      <SideBar />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" />
    </main>
  );
}
