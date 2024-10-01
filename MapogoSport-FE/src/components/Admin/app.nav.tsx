
import Link from "next/link";
import { useState } from "react";
interface NavProps {
    isAniActive: boolean;
    toggleAni: () => void;
}
export default function Nav({ isAniActive, toggleAni }: NavProps) {
    return (
        <>
            <div className={`nav-left ${isAniActive ? 'hidden' : 'hiddenRep'}`}>
                <div className="logo text-center p-2">
                    <Link href='/'>
                        <img src="/images/logo.png" style={{ width: '60%' }} alt="Logo" />
                    </Link>

                </div>
                <div className="mt-5">
                    <nav className="container m-auto">
                        <ul>
                            <li><a className="link active" href="/"><i className="bi bi-house me-2"></i>TRANG CHỦ</a></li>
                            <li><a className="link" href="#"><i className="bi bi-box-seam me-2"></i>QUẢN LÝ SÂN</a></li>
                            <li><Link className="link" href={"/admin/product"}><i className="bi bi-box-seam me-2"></i>QUẢN LÝ SẢN PHẨM</Link></li>
                            <li><Link className="link" href="#"><i className="bi bi-people me-2"></i>LỊCH ĐẶT SÂN</Link></li>
                            <li><Link className="link" href={"/admin/order"}><i className="bi bi-receipt-cutoff me-2"></i>QUẢN LÝ HÓA ĐƠN</Link></li>
                            <li><Link className="link" href={"/admin/subcription"}><i className="bi bi-ticket-detailed me-2"></i>QUẢN LÝ GÓI TÀI KHOẢN</Link></li>
                            <li><Link className="link" href={"/admin/voucher"}><i className="bi bi-ticket-detailed me-2"></i>QUẢN LÝ VOUCHER</Link></li>
                            <li><a className="link" href="#"><i className="bi bi-bar-chart me-2"></i>THỐNG KÊ</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div></>
    )
}
