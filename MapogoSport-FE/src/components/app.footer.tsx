'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content pt-5 pb-5">
                    <div className="row">
                        <div className="col-xl-4 col-lg-4 mb-50 footer-widget">
                            <div className="footer-widget-heading">
                                <h3>Mapogo</h3>
                            </div>
                            <div className="footer-text">
                                <p>© 2024 Mapogo.
                                    Chúng tôi luôn đồng hành cùng bạn trên mọi bước đường thể thao!</p>
                            </div>
                            <div className="footer-social-icon ">
                                <span>Theo dõi chúng tôi</span>
                                <Link href={""}><i className="bi bi-facebook"></i></Link>
                                <Link href={""}><i className="bi bi-instagram"></i> </Link>
                                <Link href={""}><i className="bi bi-messenger"></i> </Link>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                            <div className="footer-widget">
                                <div className="footer-widget-heading">
                                    <h3>Thông Tin</h3>
                                </div>
                                <ul>
                                    <li className="text-white">
                                        <i className="bi bi-envelope-at-fill "></i>
                                        <a href="#" className="ms-2">mapogo@gmail.com </a></li>
                                    <li className="text-white">
                                        <i className="bi bi-telephone-fill"></i>
                                        <a href="#" className="ms-2">0398917439 </a></li>
                                    <li className="text-white">
                                        <i className="bi bi-geo-alt-fill"></i>
                                        <a href="#" className="ms-2">0398917439 </a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                            <div className="footer-widget">
                                <div className="footer-widget-heading">
                                    <h3>Đăng ký</h3>
                                </div>
                                <div className="footer-text mb-25">
                                    <p>Đừng bỏ lỡ việc đăng ký nhận thông tin mới của chúng tôi bằng cách điền vào biểu mẫu bên dưới.</p>
                                </div>
                                <div className="subscribe-form">
                                    <form action="#">
                                        <input type="text" placeholder="Email Address" />
                                        <Button><i className="bi bi-send-check-fill"></i></Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-area d-flex align-items-center justify-content-center">
                <Image src="/images/logo-black.png" width={70} height={50} alt="" />
                <Link className=" text-decoration-none fw-bold ms-2"
                    style={{
                        color: 'white',
                    }}
                    href={"/"}>MapogoSport</Link>
            </div>
        </footer>
    );
}

export default Footer;
