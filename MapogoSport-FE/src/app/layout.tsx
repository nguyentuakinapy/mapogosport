import { Inter } from 'next/font/google';
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css';
import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const inter = Inter({ subsets: ['latin'] })
import LoginModal from '@/components/account/modal/login.modal';
import RegisterModal from '@/components/account/modal/register.modal';
import ChangeEmailModel from '@/components/account/modal/changeEmail.modal';
import ChangePassword from '@/components/account/modal/changePassword.modal';
import ForgotPassword from '@/components/account/modal/forgotPassword.modal';
import ChatMessenger from '@/components/app.chatMessenger';


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
        <LoginModal></LoginModal>
        <RegisterModal></RegisterModal>
        <ChangeEmailModel></ChangeEmailModel>
        <ChangePassword></ChangePassword>
        <ForgotPassword></ForgotPassword>
        <ChatMessenger></ChatMessenger>

      </body>
    </html>
  );
}
