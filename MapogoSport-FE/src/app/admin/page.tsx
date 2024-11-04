'use client'
import ProfileContent from "@/components/User/modal/user.profile";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Col, FloatingLabel, Form, Nav, Row } from "react-bootstrap";

export default function Owner({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    const searchParams = useSearchParams();
    const check = searchParams.get('check');
    useEffect(() => {
        if (check === 'withdraw') {
            setActiveTab('withdraw');
        }
    }, [check]);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/${parsedUserData.username}`);
        }
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return (
                    <div>
                        {usernameFetchApi && <ProfileContent usernameFetchApi={usernameFetchApi} />}
                    </div>
                );
            case 'deposit':
                return (
                    <div className="font-14">
                        chưa biết có gì bên trong
                    </div>
                );
            default:
                return (
                    <div className="font-14">
                        Loading...
                    </div>
                );
        }
    };
    if (!children) {
        return (
            <>
                <div className="profile-header">
                    <div className="profile-info">
                        <h2>Nguyễn Tú Akina</h2>
                        <p>Thằng nào có tiền thì nạp vào DONATE cho tao</p>
                        <div className="stats">
                            <span>0 Bài Viết</span>
                            <span>0 Sân</span>
                            <span>0 Được thích</span>
                            <span>Gói cơ bản</span>
                        </div>
                    </div>
                </div>
                <div className="font-14">
                    <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="all" className="tab-link">Thông tin cá nhân</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="deposit" className="tab-link">Bài viết</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="withdraw" className="tab-link">Phân quyền</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="mt-3">
                        {renderContent()}
                    </div>
                </div>
            </>
        )
    }
    return (
        <>{children}</>
    )

}