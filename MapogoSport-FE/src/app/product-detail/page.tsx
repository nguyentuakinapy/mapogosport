'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card, ButtonGroup, Form } from 'react-bootstrap';
import { useState } from 'react';
import '../globals.css';
import Image from 'next/image';

const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    return (
        <Container className="p-3" >
            <Row>
                {/* Hình ảnh sản phẩm */}
                <Col md={5} style={{ maxWidth: '350px' }}>
                    <Card>
                        <Card.Img src="/img/avatar.jpg" alt="Hình ảnh sản phẩm" />
                    </Card>

                    {/* Hình ảnh thu nhỏ */}
                    <div className="thumbnail-container mt-3" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <Image
                            src="/img/avatar.jpg"
                            alt="Hình ảnh thu nhỏ"
                            width={130} // Kích thước hình ảnh thu nhỏ
                            height={130}
                            className='img-thumbnail'
                        />
                        <Image
                            src="/img/avatar.jpg"
                            alt="Hình ảnh thu nhỏ"
                            width={130} // Kích thước hình ảnh thu nhỏ
                            height={130}
                            className='img-thumbnail'
                        />
                        <Image
                            src="/img/avatar.jpg"
                            alt="Hình ảnh thu nhỏ"
                            width={130} // Kích thước hình ảnh thu nhỏ
                            height={130}
                            className='img-thumbnail'
                        />
                    </div>
                </Col>

                {/* Thông tin sản phẩm */}
                <Col md={7} className='ms-5' style={{ marginLeft: '100px' }}>
                    <h4 className='mb-2'>Tên sản phẩm: Sản phẩm tự chế</h4>
                    <p className='mb-2'>
                        <span className="text-warning">★★★★★</span>
                    </p>
                    <h5 className='mb-2'>Giá sản phẩm: 100.000.000 VND</h5>
                    <div className="d-flex align-items-center mb-4">
                        <span>Số lượng</span>
                        <ButtonGroup className="ms-3">
                            <Button variant="outline-secondary" onClick={decreaseQuantity}>-</Button>
                            <Form.Control type="text" value={quantity} readOnly className="text-center" style={{ width: '50px' }} />
                            <Button variant="outline-secondary" onClick={increaseQuantity}>+</Button>
                        </ButtonGroup>
                    </div>

                    {/* Nút hành động */}
                    <div className="d-flex">
                        <Button variant="danger">Thêm vào giỏ hàng</Button>
                    </div>

                    <div className='h-50 mt-4' style={{ color: "red", border: '1px solid orange', borderRadius: '10px' }}>
                        <span>Mô tả: </span>
                    </div>
                </Col>
            </Row>

        </Container >
    );
};

export default ProductDetail;
