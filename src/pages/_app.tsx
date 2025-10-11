import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="bg-background w-full font-manrope overflow-x-hidden">
      <Component {...pageProps} />
    </main>
  );
}
