'use client'
import Image from "next/image";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content pt-5 pb-5">
                    <Row>
                        <Col xl={4} lg={4}>
                            <div className="footer-widget">
                                <div className="footer-logo">
                                    <Link href={"/"} className="text-decoration-none">
                                        <Image src="/images/logo-black.png" width={80} height={40} alt="" />
                                        <b className="text-white ms-2">Mapogo Sport</b>
                                    </Link>
                                </div>
                                <div className="footer-text">
                                    <p>Đồng hành cùng bạn trên mọi bước đường thể thao!</p>
                                </div>
                                <div className="footer-social-icon ">
                                    <span>Theo dõi chúng tôi</span>
                                    <Link href="#"><i className="bi bi-facebook"></i></Link>
                                    <Link href="#"><i className="bi bi-instagram"></i> </Link>
                                    <Link href="#"><i className="bi bi-messenger"></i> </Link>
                                </div>
                            </div>
                        </Col>
                        <Col xl={4} lg={4}>
                            <div className="footer-widget">
                                <div className="footer-widget-heading"><h3>Thông Tin</h3></div>
                                <Row className="text-white mt-5">
                                    <Col>
                                        <i className="bi bi-envelope-at-fill "></i>
                                        <span className="ms-2">mapogo@gmail.com</span>
                                    </Col>
                                    <Col>
                                        <i className="bi bi-telephone-fill"></i>
                                        <span className="ms-2">0398917439</span>
                                    </Col>
                                    <div className="mt-3">
                                        <i className="bi bi-geo-alt-fill"></i>
                                        <span className="ms-2">Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh</span>
                                    </div>
                                </Row>
                            </div>
                        </Col>
                        <Col xl={4} lg={4}>
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
                        </Col>
                    </Row>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
