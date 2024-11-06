'use client'
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Header from "./app.header";
import Footer from "./app.footer";
import { UserProvider } from "@/app/context/UserContext";
import { vi } from "date-fns/locale/vi";
import { registerLocale, setDefaultLocale } from "react-datepicker";

registerLocale('vi', vi);
setDefaultLocale('vi');

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [refreshKey, setRefreshKey] = useState<number>(0);

    return (
        <UserProvider refreshKey={refreshKey} >
            <Header setRefreshKey={setRefreshKey} refreshKey={refreshKey} />
            <main className='bg-web main-area pb-5'>{children}</main>
            <Footer />
        </UserProvider>
    )
}