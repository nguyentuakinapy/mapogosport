'use client'
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./Sidebar/Index";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Container>
            <Row className="py-3">
                <Col xs={12} md={3} lg={3}>
                    <Sidebar />
                </Col>
                <Col xs={12} md={9} lg={9} className="menu-user">
                    {children}
                </Col>
            </Row>
        </Container>
    )
}