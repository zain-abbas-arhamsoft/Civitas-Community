import React from "react";
import Head from "next/head";
import Header from "@/components/organization/Header";

/**
 * Layout component designed for organization pages, with an external stylesheet for carousel styling.
 * @param {React.ReactNode} children - The content to be displayed within the main area.
 * @returns {JSX.Element} - Rendered organization layout with the provided children content.
 */
const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <Header />

      <main>{children}</main>
    </>
  );
};

export default Layout;
