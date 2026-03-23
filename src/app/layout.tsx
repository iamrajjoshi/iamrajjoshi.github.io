import "./globals.css";
import { Inter, Poppins, Geist } from "next/font/google";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable, "font-sans", geist.variable)}>
      <head>
        <title>Raj Joshi</title>
        <meta name="description" content="Raj Joshi's personal website." />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐙</text></svg>" />
        <meta property="og:title" content="Raj Joshi" />
        <meta property="og:description" content="SWE at Zip, previously at Sentry. Probably running." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rajjoshi.me" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Raj Joshi" />
        <meta name="twitter:description" content="SWE at Zip, previously at Sentry. Probably running." />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
