import { ModalProvider } from "@/components/modals/Modal";
import Toast from "@/components/toast/toast";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="bg-background w-full font-manrope overflow-x-hidden">
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
    </main>
  );
}
