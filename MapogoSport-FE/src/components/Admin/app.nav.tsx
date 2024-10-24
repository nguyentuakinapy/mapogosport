
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
                    <a href='/'>
                        <img src="/images/logo.png" style={{ width: '60%' }} alt="Logo" />
                    </a>

                </div>
                <div className="mt-5">
                    <nav className="container m-auto">
                        <ul>
                            <li><a className={`link ${isActive == 1 ? 'active' : ''}`} href="/admin" onClick={() => setIsActive(1)}><i className="bi bi-house me-2"></i>TRANG CHỦ</a></li>
                            <li><Link className={`link ${isActive == 3 ? 'active' : ''}`} href={"/admin/product"} onClick={() => setIsActive(3)}><i className="bi bi-box-seam me-2"></i>QUẢN LÝ SẢN PHẨM</Link></li>
                            <li><Link className={`link ${isActive == 5 ? 'active' : ''}`} href={"/admin/order"} onClick={() => setIsActive(5)}><i className="bi bi-receipt-cutoff me-2"></i>QUẢN LÝ HÓA ĐƠN</Link></li>
                            <li><Link className={`link ${isActive == 6 ? 'active' : ''}`} href={"/admin/subcription"} onClick={() => setIsActive(6)}><i className="bi bi-ticket-detailed me-2"></i>QUẢN LÝ GÓI</Link></li>
                            <li><Link className={`link ${isActive == 7 ? 'active' : ''}`} href={"/admin/voucher"} onClick={() => setIsActive(7)}><i className="bi bi-ticket-detailed me-2"></i>QUẢN LÝ VOUCHER</Link></li>
                            <li><Link className={`link ${isActive == 8 ? 'active' : ''}`} href="/admin/statistics" onClick={() => setIsActive(8)}><i className="bi bi-bar-chart me-2"></i>THỐNG KÊ</Link></li>
                            <li><Link className={`link ${isActive == 9 ? 'active' : ''}`} href="/admin/categories" onClick={() => setIsActive(9)}><i className="bi bi-box-seam me-2"></i>QUẢN LÝ LOẠI</Link></li>

                        </ul>
                    </nav>
                </div>
            </div ></>
    )
}
