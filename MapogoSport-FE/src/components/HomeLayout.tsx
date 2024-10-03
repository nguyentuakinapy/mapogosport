'use client'
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Header from "./app.header";
import Footer from "./app.footer";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
  
    return (
        <>
            <Header  />
            <main className='bg-web main-area pb-5'>{children}</main>
            <Footer />
        </>
    )
}