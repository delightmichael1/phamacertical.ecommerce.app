import React from "react";
import Head from "next/head";
import "@/styles/globals.css";
import Script from "next/script";
import type { AppProps } from "next/app";
import Toast from "@/components/toast/toast";
import { ModalProvider } from "@/components/modals/Modal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className="bg-background w-full overflow-x-hidden font-manrope text-xs"
      suppressHydrationWarning
    >
      <Head>
        <title>PharmNex</title>
        <meta
          name="description"
          content="Medilazar is your trusted online pharmacy, offering a wide range of healthcare products and medications with fast delivery and expert advice."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <ModalProvider>
        <Component {...pageProps} />
        <Toast />
      </ModalProvider>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" />
    </main>
  );
}
