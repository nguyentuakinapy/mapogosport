import { Inter } from 'next/font/google';
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css';
import type { Metadata } from "next";

import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const inter = Inter({ subsets: ['latin'] })
import ChangeEmailModel from '@/components/account/modal/changeEmail.modal';
import ChangePassword from '@/components/account/modal/changePassword.modal';
import ForgotPassword from '@/components/account/modal/forgotPassword.modal';
import ChatMessenger from '@/components/app.chatMessenger';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


export const metadata: Metadata = {
  title: "Mapogo Sport",
  icons: {
    icon: "/images/logo.png"
  },
  description: "Hệ thống quản lý sân thể thao và cung cấp dụng cụ thể thao Mapogo Sport"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChangeEmailModel></ChangeEmailModel>
        <ChangePassword></ChangePassword>
        <ChatMessenger></ChatMessenger>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </body>
    </html>
  );
}
