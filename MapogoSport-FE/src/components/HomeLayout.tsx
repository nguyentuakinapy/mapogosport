'use client'
import React, { useState } from "react";
import Header from "./app.header";
import Footer from "./app.footer";
import { UserProvider } from "@/app/context/UserContext";
import { vi } from "date-fns/locale/vi";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ChatMessenger from '@/components/app.chatMessenger';

registerLocale('vi', vi);
setDefaultLocale('vi');

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [refreshKey, setRefreshKey] = useState<number>(0);

    return (
        <UserProvider refreshKey={refreshKey} >
            <Header setRefreshKey={setRefreshKey} refreshKey={refreshKey} />
            <main className='bg-web main-area pb-5'>{children}
            </main>
            <ChatMessenger ></ChatMessenger>
            <Footer />
        </UserProvider>
    )
}