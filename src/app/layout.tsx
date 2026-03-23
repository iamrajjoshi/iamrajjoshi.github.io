import "./globals.css";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${poppins.variable}`}>
      <head>
        <title>Raj Joshi</title>
        <meta name="description" content="Raj Joshi's personal website." />
        <meta name="theme-color" content="#0a0a0f" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐙</text></svg>"
        />
        <meta property="og:title" content="Raj Joshi" />
        <meta
          property="og:description"
          content="SWE at Zip, previously at Sentry. Probably running."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rajjoshi.me" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Raj Joshi" />
        <meta
          name="twitter:description"
          content="SWE at Zip, previously at Sentry. Probably running."
        />
      </head>
      <body className="bg-[#0a0a0f] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
