import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Include the Google Maps API script here */}
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5asBIrHFprvr1AUv0a1nGGTVKAacOKPo&libraries=places"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
