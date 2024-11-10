import Link from "next/link";
import { usePathname } from "next/navigation";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface NavProps {
    isAniActive: boolean;
}
export default function Nav({ isAniActive }: NavProps) {
    const path = usePathname();

    const logOut = () => {
        localStorage.removeItem('username');
        sessionStorage.removeItem('user');
        window.location.href = "/";
    }

    return (
        <>
            {!isAniActive ?
                <div className={`nav-left-block`}>
                    <div className="logo text-center p-2">
                        <a href="/"> <img src="/images/logo.png" style={{ width: '60%' }} alt="Logo" /></a>
                    </div>
                    <div className="mt-5">
                        <nav className="container m-auto">
                            <ul>
                                <li><Link className={`link ${path === '/owner' ? 'active' : ''}`} href="/owner"><i className="bi bi-house me-2" ></i>TRANG CHỦ</Link></li>
                                <li><Link className={`link ${path == '/owner/sport-manager' ? 'active' : ''}`} href="/owner/sport-manager"><i className="bi bi-box-seam me-2"></i>QUẢN LÝ SÂN</Link></li>
                                <li><Link className={`link ${path == '/owner/booking-sport' ? 'active' : ''}`} href="/owner/booking-sport"><i className="bi bi-layout-text-window-reverse me-2"></i>LỊCH ĐẶT SÂN</Link></li>
                                <li><Link className={`link ${path == '/owner/booking-bill' ? 'active' : ''}`} href="/owner/booking-bill" ><i className="bi bi-receipt me-2"></i>HÓA ĐƠN</Link></li>
                                <li><Link className={`link ${path == '/owner/statistic' ? 'active' : ''}`} href="/owner/statistic"><i className="bi bi-bar-chart me-2"></i>THỐNG KÊ</Link></li>
                                <li><a style={{ cursor: 'pointer' }} className={`link`} onClick={() => logOut()} ><i className="bi bi-box-arrow-left me-2"></i>ĐĂNG XUẤT</a></li>
                            </ul >
                        </nav >
                    </div >
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
                                        <Link className={`link ${path === '/owner' ? 'active' : ''}`} href="/owner"><i className="bi bi-house" ></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Quản lý sân</Tooltip>}>
                                        <Link className={`link ${path == '/owner/sport-manager' ? 'active' : ''}`} href="/owner/sport-manager"><i className="bi bi-box-seam"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Lịch đặt sân</Tooltip>}>
                                        <Link className={`link ${path == '/owner/booking-sport' ? 'active' : ''}`} href="/owner/booking-sport">
                                            <i className="bi bi-layout-text-window-reverse"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Hóa đơn đặt sân</Tooltip>}>
                                        <Link className={`link ${path == '/owner/booking-bill' ? 'active' : ''}`} href="/owner/booking-bill" ><i className="bi bi-receipt"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Thống kê</Tooltip>}>
                                        <Link className={`link ${path == '/owner/statistic' ? 'active' : ''}`} href="/owner/statistic"><i className="bi bi-bar-chart"></i></Link>
                                    </OverlayTrigger>
                                </li>
                                <li>
                                    <OverlayTrigger overlay={<Tooltip>Đăng xuất</Tooltip>}>
                                        <a style={{ cursor: 'pointer' }} className={`link`} onClick={() => logOut()} ><i className="bi bi-box-arrow-left"></i></a>
                                    </OverlayTrigger>
                                </li>
                            </ul >
                        </nav >
                    </div >
                </div >
            }
        </>
    )
}
