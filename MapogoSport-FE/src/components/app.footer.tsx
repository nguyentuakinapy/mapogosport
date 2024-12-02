'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";

const Footer = () => {
    return (
        <>
            <section>
                <footer className="footer-section">
                    <div className="container">
                        <div className="footer-content pt-5 pb-5">
                            <div className="row">
                                <div className="col-xl-4 col-lg-4 mb-50">
                                    <div className="footer-widget">
                                        <div className="footer-logo">
                                            <a href="index.html">
                                                <Image src="/images/logo-black.png" width={80} height={40} alt="" />
                                                <a className=" text-decoration-none text-white" href="#">MapogoSport</a>
                                            </a>
                                        </div>
                                        <div className="footer-text">
                                            <p>© 2024 Mapogo.
                                                Chúng tôi luôn đồng hành cùng bạn trên mọi bước đường thể thao!</p>
                                        </div>
                                        <div className="footer-social-icon ">
                                            <span>Theo dỗi chúng tôi</span>
                                            <Link href="#"><i className="bi bi-facebook"></i></Link>
                                            <Link href="#"><i className="bi bi-instagram"></i> </Link>
                                            <Link href="#"><i className="bi bi-messenger"></i> </Link>
                                        </div>
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
                    <div className="copyright-area">
                        <div className="container">
                            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>

                            </div>
                        </div>
                    </div>
                </footer>

            </section >
        </>
    );
}

export default Footer;
