import Head from "next/head";
import "@/styles/globals.css";
import Script from "next/script";
import type { AppProps } from "next/app";
import Toast from "@/components/toast/toast";
import React, { useEffect, useState } from "react";
import AuthProvider from "@/components/AuthProvider";
import { ModalProvider } from "@/components/modals/Modal";
import SideBar from "@/components/SideBar";

export default function App({ Component, pageProps }: AppProps) {
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    const handleSetHeight = () => {
      setPageHeight(window.innerHeight);
    };
    handleSetHeight();

    window.addEventListener("resize", handleSetHeight);
    return () => {
      window.removeEventListener("resize", handleSetHeight);
    };
  }, []);

  return (
    <main
      id="main"
      className="bg-gradient-to-tl from-background-2 to-background w-full overflow-x-hidden font-poppins text-xs"
      style={{ height: `${pageHeight}px` }}
    >
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
          <Component {...pageProps} />
          <Toast />
        </ModalProvider>
      </AuthProvider>
      <SideBar />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" />
    </main>
  );
}
