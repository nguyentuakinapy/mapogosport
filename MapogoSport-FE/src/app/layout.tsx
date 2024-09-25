import { Inter } from 'next/font/google';
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] })

import Header from '@/components/app.header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/app.footer';
import LoginModal from '@/components/account/modal/login.modal';
import RegisterModal from '@/components/account/modal/register.modal';
import ChangeEmailModel from '@/components/account/modal/changeEmail.modal';
import ChangePassword from '@/components/account/modal/changePassword.modal';
import ForgotPassword from '@/components/account/modal/forgotPassword.modal';


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
      <body className={inter.className}>
        <Header />
        <main className='bg-light main-area pb-5'>{children}</main>
        <Footer />
        <LoginModal></LoginModal>
        <RegisterModal></RegisterModal>
        <ChangeEmailModel></ChangeEmailModel>
        <ChangePassword></ChangePassword>
        <ForgotPassword></ForgotPassword>
      </body>
    </html>
  );
}
