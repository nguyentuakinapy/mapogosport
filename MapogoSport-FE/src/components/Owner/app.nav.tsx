import Link from "next/link";
import { useState } from "react";
interface NavProps {
    isAniActive: boolean;
    toggleAni: () => void;
    isActive: number;
    setIsActive: (index: number) => void;
}
export default function Nav({ isAniActive, isActive, setIsActive }: NavProps) {

    return (
        <>
            <div className={`nav-left ${isAniActive ? 'hidden' : 'hiddenRep'}`}>
                <div className="logo text-center p-2">
                    <a href="/"> <img src="/images/logo.png" style={{ width: '60%' }} alt="Logo" /></a>
                </div>
                <div className="mt-5">
                    <nav className="container m-auto">
                        <ul>
                            <li><Link className={`link ${isActive == 1 ? 'active' : ''}`} href="/owner" onClick={() => setIsActive(1)}><i className="bi bi-house me-2" ></i>TRANG CHỦ</Link></li>
                            <li><Link className={`link ${isActive == 2 ? 'active' : ''}`} href="/owner/sport-manager" onClick={() => setIsActive(2)}><i className="bi bi-box-seam me-2"></i>QUẢN LÝ SÂN</Link></li>
                            <li><Link className={`link ${isActive == 3 ? 'active' : ''}`} href="/owner/booking-sport" onClick={() => setIsActive(3)}><i className="bi bi-people me-2"></i>LỊCH ĐẶT SÂN</Link></li>
                            <li><Link className={`link ${isActive == 4 ? 'active' : ''}`} href="/owner/booking-sport" onClick={() => setIsActive(4)}><i className="bi bi-receipt me-2"></i>HÓA ĐƠN</Link></li>
                            <li><Link className={`link ${isActive == 5 ? 'active' : ''}`} href="/owner/booking-sport" onClick={() => setIsActive(5)}><i className="bi bi-bar-chart me-2"></i>THỐNG KÊ</Link></li>
                            <li><Link className={`link ${isActive == 6 ? 'active' : ''}`} href="/owner/authority" onClick={() => setIsActive(6)}><i className="bi bi-bar-chart me-2"></i>PHÂN QUYỀN</Link></li>
                            <li><Link className={`link ${isActive == 7 ? 'active' : ''}`} href="/owner/booking-sport" onClick={() => setIsActive(7)}><i className="bi bi-bar-chart me-2"></i>ĐĂNG XUẤT</Link></li>
                        </ul>
                    </nav>
                </div>
            </div></>
    )
}
