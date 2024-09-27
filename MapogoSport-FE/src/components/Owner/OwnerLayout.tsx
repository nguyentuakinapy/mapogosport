'use client'
import React from "react";
import Nav from "./app.nav";
import './owner.css'
import Header from "./app.header";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Nav />
            <Header />
            <main className="main-right">
                <div className="main-body">
                    {children}
                </div>
            </main>
        </>
    )
}