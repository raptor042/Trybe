import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { Web3Modal } from "./context/web3modal";
import { StateProvider } from "./context/store";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({

  children,

}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StateProvider>
          <Web3Modal>
            <Navbar />
            {children}
            <Footer />
          </Web3Modal>
        </StateProvider>
      </body>
    </html>
  );
}


