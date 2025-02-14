import { storyblokInit, apiPlugin } from "@storyblok/react";
import { AuthProvider } from "../lib/context/AuthContext";
import Head from 'next/head';

import Feature from "../components/storyblok/Feature";
import Grid from "../components/storyblok/Grid";
import Page from "../components/storyblok/Page";
import Teaser from "../components/storyblok/Teaser";
// import Search from "../components/storyblok/Search";
import Hero from "../components/storyblok/Hero";
import Layout from "../components/Layout";
import PageDetail from "../components/storyblok/PageDetail";
import PageCategory from "../components/storyblok/PageCategory";

import '../assets/styles/reset.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const components = {
  feature: Feature,
  grid: Grid,
  teaser: Teaser,
  page: Page,
  // search: Search,
  hero: Hero,
  'page-detail': PageDetail,
  'page-category': PageCategory,
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: 'us'
  }
});

function MyApp({ Component, pageProps }) {
  const { key, ...rest } = pageProps;
  return (
    <AuthProvider>
      <Head>
        <title>{pageProps?.story?.name} | Coloring Page Magic - Free Printable Coloring Pages</title>
      </Head>
      <Layout>
        <Component key={key} {...rest} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
