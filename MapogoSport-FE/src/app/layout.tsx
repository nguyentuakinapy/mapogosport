import '/node_modules/bootstrap-icons/font/bootstrap-icons.css';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from '@/components/app.header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/app.footer';


// const geistMono = localFont({
//   src: "/fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

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
      {/* <body className={geistMono.className} > */}
      <body>
        <Header />
        <main>{children}</main>
        <Footer></Footer>
      </body>
    </html>
  );
}
