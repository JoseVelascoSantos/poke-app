import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import React from "react";
import Layout from "@/components/layout/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My Pokémon App</title>
        <meta name="description" content="A Pokémon app built with Next.js" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
