import { Button, Col, Container, Row } from 'react-bootstrap';
import HomeLayout from '@/components/HomeLayout';
import './subcription.scss'

const SubcriptionPage = () => {
    const bodyPackageContent = [
        "Mua gói đăng ký đi",
        "Làm ơn",
        "Nếu không thì chúng tôi chết đói mất"
    ];
    return (
        <HomeLayout>
            <Container>
                <h3 className='text-danger text-center fw-bold my-3' style={{ fontSize: '20px' }}>Quản Lý Gói Đăng Ký</h3>
                <Row className="my-3" style={{ fontSize: '15px' }}>
                    <Col xs={4}>
                        <div className="card packageUpdate">
                            <b className="ms-3 mt-3 fs-5">Gói cơ bản</b>
                            <div className="body-package my-3">
                                {bodyPackageContent.map((content, index) => (
                                    <div key={index}>
                                        <i className="bi bi-check-circle me-2"></i>
                                        {content}
                                    </div>
                                ))}
                            </div>
                            <b className="text-danger ms-3">Miễn phí</b>
                            <Button className='btn-sub'>Sửa</Button>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="card packageUpdate">
                            <b className="ms-3 mt-3 fs-5">Gói cơ bản</b>
                            <div className="body-package my-3">
                                {bodyPackageContent.map((content, index) => (
                                    <div key={index}>
                                        <i className="bi bi-check-circle me-2"></i>
                                        {content}
                                    </div>
                                ))}
                            </div>
                            <b className="text-danger ms-3">Miễn phí</b>
                            <Button className='btn-sub'>Sửa</Button>
                        </div>
                    </Col><Col xs={4}>
                        <div className="card packageUpdate">
                            <b className="ms-3 mt-3 fs-5">Gói cơ bản</b>
                            <div className="body-package my-3">
                                {bodyPackageContent.map((content, index) => (
                                    <div key={index}>
                                        <i className="bi bi-check-circle me-2"></i>
                                        {content}
                                    </div>
                                ))}
                            </div>
                            <b className="text-danger ms-3">Miễn phí</b>
                            <Button className='btn-sub'>Sửa</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </HomeLayout>
    )
}

export default SubcriptionPage;