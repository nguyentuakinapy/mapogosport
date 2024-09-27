'use client'

import { Button, Container, Form } from "react-bootstrap";

const Footer = () => {
    return (
        <>
            <section>
                <footer className="bg-white">
                    <div className="container p-4">
                        <div className="row">
                            <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                                <h5 className="text-uppercase">Chính sách</h5>
                                <p>
                                    ...
                                </p>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase">Liên hệ</h5>

                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <a href="#!" className="text-body">...</a>
                                    </li>
                                    {/* <li>
                                        <a href="#!" className="text-body">Zalo</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-body">Email</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-body">Link 4</a>
                                    </li> */}
                                </ul>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase mb-0">Thông tin</h5>

                                <ul className="list-unstyled">
                                    <li>
                                        <a href="#!" className="text-body">...</a>
                                    </li>
                                    {/* <li>
                                        <a href="#!" className="text-body">Link 2</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-body">Link 3</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-body">Link 4</a>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
                <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    <img src="/images/logo.png" style={{ width: '50px' }} alt="" />
                    <a className="text-body text-decoration-none" href="#">MapogoSport</a>
                </div>
            </section >
        </>
    )
}
export default Footer;