// app/layout.jsx  (Next.js App Router)
// Add the <link> tags inside your existing <head> or RootLayout

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

// ── Pages Router (_document.jsx) ──────────────────────────────────────────────
// If you're using the older Pages Router, add to pages/_document.jsx:
//
// import { Html, Head, Main, NextScript } from "next/document";
// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&..."
//           rel="stylesheet"
//         />
//       </Head>
//       <body><Main /><NextScript /></body>
//     </Html>
//   );
// }
