export default function Nav() {
    return (
        <>
            <div className="nav-left">
                <div className="logo text-center p-2">
                    <img src="/images/logo.png" style={{ width: '60%' }} alt="Logo" />
                </div>
                <div className="mt-5">
                    <nav className="navbar">
                        <ul>
                            <li><a className="link" href="/"><i className="bi bi-house me-2"></i>TRANG CHỦ</a></li>
                            <li><a className="link" href="#"><i className="bi bi-box-seam me-2"></i>QUẢN LÝ SÂN</a></li>
                            <li><a className="link" href="#"><i className="bi bi-people me-2"></i>LỊCH ĐẶT SÂN</a></li>
                            <li><a className="link" href="#"><i className="bi bi-receipt me-2"></i>HÓA ĐƠN</a></li>
                            <li><a className="link" href="#"><i className="bi bi-bar-chart me-2"></i>THỐNG KÊ</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div></>
    )
}
