import { Inter } from 'next/font/google';
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css';
import type { Metadata } from "next";
<<<<<<< HEAD
// import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
=======
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const inter = Inter({ subsets: ['latin'] })
import LoginModal from '@/components/account/modal/login.modal';
import RegisterModal from '@/components/account/modal/register.modal';
import ChangeEmailModel from '@/components/account/modal/changeEmail.modal';
import ChangePassword from '@/components/account/modal/changePassword.modal';
import ForgotPassword from '@/components/account/modal/forgotPassword.modal';

>>>>>>> 077ec48c18fdd35497be8616fca27c38bf408ef3

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
<<<<<<< HEAD
      <body >
=======
      <body className={inter.className}>
>>>>>>> 077ec48c18fdd35497be8616fca27c38bf408ef3
        {children}
        <LoginModal></LoginModal>
        <RegisterModal></RegisterModal>
        <ChangeEmailModel></ChangeEmailModel>
        <ChangePassword></ChangePassword>
        <ForgotPassword></ForgotPassword>
      </body>
    </html>
  );
}
