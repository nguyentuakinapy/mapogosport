
import { useData } from "@/app/context/UserContext";
import { logOut } from "@/app/utils/Log-Out";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
interface NavProps {
    isAniActive: boolean;
    toggleAni: () => void;
}
export default function Nav({ isAniActive, toggleAni }: NavProps) {
    const path = usePathname();

    const userData = useData();

    return (
        <>
            {!isAniActive ?
                <div className={`nav-left-block`}>
                    <div className="logo text-center p-2">
                        <a href='/'>
                            <img src="/images/logo.png" style={{ width: '60%' }} alt="Logo" />
                        </a>

                    </div>
                    <div className="mt-5">
                        <nav className="container m-auto">
                            <ul>
                                <li><a className={`link ${path === '/admin' ? 'active' : ''}`} href="/admin" ><i className="bi bi-house me-2"></i>TRANG CHỦ</a></li>
                                <li><Link className={`link ${path === '/admin/product' ? 'active' : ''}`} href={"/admin/product"} ><i className="bi bi-box-seam me-2"></i>QUẢN LÝ SẢN PHẨM</Link></li>
                                <li><Link className={`link ${path === '/admin/order' ? 'active' : ''}`} href={"/admin/order"} ><i className="bi bi-receipt-cutoff me-2"></i>QUẢN LÝ HÓA ĐƠN</Link></li>
                                <li><Link className={`link ${path === '/admin/subcription' ? 'active' : ''}`} href={"/admin/subcription"}><i className="bi bi-ticket-detailed me-2"></i>QUẢN LÝ GÓI</Link></li>
                                <li><Link className={`link ${path === '/admin/voucher' ? 'active' : ''}`} href={"/admin/voucher"} ><i className="bi bi-ticket-detailed me-2"></i>QUẢN LÝ VOUCHER</Link></li>
                                <li><Link className={`link ${path === '/admin/categories' ? 'active' : ''}`} href="/admin/categories" ><i className="bi bi-box-seam me-2"></i>QUẢN LÝ LOẠI</Link></li>
                                {userData?.authorities.find(item => item.role.name == "ROLE_ADMIN") && (
                                    <li><Link className={`link ${path === '/admin/statistics' ? 'active' : ''}`} href="/admin/statistics"><i className="bi bi-bar-chart me-2"></i>THỐNG KÊ</Link></li>
                                )}
                                <li><a style={{ cursor: 'pointer' }} className={`link`} onClick={() => logOut()} ><i className="bi bi-box-arrow-left me-2"></i>ĐĂNG XUẤT</a></li>
                            </ul>
                        </nav>
                    </div>
                </div >
                :
                <div className={`nav-left-none-icon`}>
                    <div className="logo text-center mt-3">
                        <a href="/"> <img src="/images/logo.png" style={{ width: '100%' }} alt="Logo" /></a>
                    </div>
                    <div className="mt-5">
                        <nav className="container m-auto">
                            <ul>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Thông tin cá nhân</Tooltip>}>
                                        <a className={`link ${path === '/admin' ? 'active' : ''}`} href="/admin" ><i className="bi bi-house me-2"></i></a>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Quản lý sản phẩm</Tooltip>}>
                                        <Link className={`link ${path === '/admin/product' ? 'active' : ''}`} href={"/admin/product"} ><i className="bi bi-box-seam me-2"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Quản lý hóa đơn</Tooltip>}>
                                        <Link className={`link ${path === '/admin/order' ? 'active' : ''}`} href={"/admin/order"} ><i className="bi bi-receipt-cutoff me-2"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Quản lý gói tài khoản</Tooltip>}>
                                        <Link className={`link ${path === '/admin/subcription' ? 'active' : ''}`} href={"/admin/subcription"}><i className="bi bi-ticket-detailed me-2"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Quản lý mã giảm giá</Tooltip>}>
                                        <Link className={`link ${path === '/admin/voucher' ? 'active' : ''}`} href={"/admin/voucher"} ><i className="bi bi-ticket-detailed me-2"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Quản lý loại sân và sản phẩm</Tooltip>}>
                                        <Link className={`link ${path === '/admin/categories' ? 'active' : ''}`} href="/admin/categories" ><i className="bi bi-box-seam me-2"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                {userData?.authorities.find(item => item.role.name == "ROLE_ADMIN") && (
                                    <li>
                                        <OverlayTrigger overlay={<Tooltip>Thống kê</Tooltip>}>
                                            <Link className={`link ${path === '/admin/statistics' ? 'active' : ''}`} href="/admin/statistics"><i className="bi bi-bar-chart me-2"></i></Link>
                                        </OverlayTrigger>
                                    </li>
                                )}
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Đăng xuất</Tooltip>}>
                                        <a style={{ cursor: 'pointer' }} className={`link`} onClick={() => logOut()} ><i className="bi bi-box-arrow-left me-2"></i></a>
                                    </OverlayTrigger>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div >
            }

        </>
    )
}
