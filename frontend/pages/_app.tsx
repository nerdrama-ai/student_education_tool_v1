// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // initialize theme mode
    const mode = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Quizway — Futuristic Learning</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
