import { Button, Col, Row } from 'react-bootstrap';
import '../adminStyle.scss';

const SubcriptionPage = () => {
    const bodyPackageContent = [
        "Mua gói đăng ký đi",
        "Làm ơn",
        "Nếu không thì chúng tôi chết đói mất"
    ];
    return (
        <div>
            <div className="box-ultil">
                <b className='text-danger' style={{ fontSize: '20px' }}>Quản Lý Gói Đăng Ký</b>
                <Button className="btn-sd-admin" style={{ fontSize: '15px' }}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm Gói Đăng Ký
                </Button>
            </div>
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

            </Row>
        </div>
    )
}

export default SubcriptionPage;