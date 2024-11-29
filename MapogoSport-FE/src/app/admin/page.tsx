'use client'
import ProfileContent from "@/components/User/modal/user.profile";
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useData } from "../context/UserContext";
import BlogManager from "@/components/blog/blog-manager";
import Wallet from "@/components/User/modal/wallet";
import AuthorityComponent from "@/components/Admin/authority";

export default function Owner() {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');
    const userData = useData();

    useEffect(() => {
        if (userData) {
            setUsernameFetchApi(`http://localhost:8080/rest/user/${userData.username}`);
        }
    }, [userData]);


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
                        <BlogManager></BlogManager>
                    </div>
                );
            case 'wallet':
                return (
                    <div className="font-14">
                        <Wallet></Wallet>
                    </div>
                );
            case 'authority':
                return (
                    <div className="font-14">
                        <AuthorityComponent />
                    </div>
                );
            default:
                window.location.href = "/"
        }
    };
    return (
        <>
            <div className="profile-header">
                <div className="profile-info">
                    <h2>{userData?.fullname}</h2>
                    {/* <p>Thằng nào có tiền thì nạp vào DONATE cho tao</p> */}
                    <div className="stats">
                        <span>0 Bài Viết</span>
                        <span>0 Sân</span>
                        <span>0 Được thích</span>
                        <span>{userData?.authorities.find(item => item.role.name === 'ROLE_ADMIN')?.role.name ? "Quản trị viên" : 'Nhân viên'}</span>
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
                        <Nav.Link eventKey="wallet" className="tab-link">Ví & Tài khoản ngân hàng</Nav.Link>
                    </Nav.Item>
                    {userData?.authorities.find(item => item.role.name === 'ROLE_ADMIN')?.role.name &&
                        <Nav.Item>
                            <Nav.Link eventKey="authority" className="tab-link">Phân quyền</Nav.Link>
                        </Nav.Item>
                    }

                </Nav>
                <div className="mt-3">
                    {renderContent()}
                </div>
            </div>
        </>
    )
}