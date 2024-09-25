import { Inter } from 'next/font/google';
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css';
import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const inter = Inter({ subsets: ['latin'] })
import Header from '@/components/app.header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/app.footer';


export const metadata: Metadata = {
  title: "Trang Chủ",
  icons: {
    icon: "/images/logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className='bg-web'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
