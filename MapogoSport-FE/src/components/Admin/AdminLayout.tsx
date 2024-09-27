'use client'
import React, { useState } from "react";
import Nav from "./app.nav";
import './admin.css'
import Header from "./app.header";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAniActive, setIsAniActive] = useState(false);

    const toggleAni = () => {
        setIsAniActive(!isAniActive);
    }
    return (
        <>
            <Nav isAniActive={isAniActive} toggleAni={toggleAni} />
            <Header isAniActive={isAniActive} toggleAni={toggleAni} />
            <main className={`main-right ${isAniActive ? 'mainRight' : ''}`}>
                <div className="main-body">
                    {children}
                </div>
            </main>
        </>
    )
}