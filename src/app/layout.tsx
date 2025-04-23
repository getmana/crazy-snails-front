import type { Metadata } from "next";
import { Raleway, Pacifico } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  weight: ['400', '600'],
  subsets: ["latin", "cyrillic"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: ['400'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crazy Snails",
  description: "Discover the world by traveling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pacifico.variable} ${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
