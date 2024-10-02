import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import '../admin.scss';

interface UserProps {
    showEditRole: boolean;
    setShowEditRole: (v: boolean) => void;
}

const Authority = (props: UserProps) => {
    const { showEditRole, setShowEditRole } = props;

    const handleClose = () => {
        setShowEditRole(false);
    }

    const handleSave = () => {
        handleClose();
    }

    return (
        <>
            <Modal show={showEditRole} onHide={handleClose} centered backdrop="static" keyboard={false} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Thêm sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={8}>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="text" placeholder="Tên" />
                                                <Form.Label htmlFor="name">Tên sản phẩm <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="number" placeholder="Giá" />
                                                <Form.Label htmlFor="price">Giá <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="text" placeholder="Hãng" />
                                                <Form.Label htmlFor="brand">Hãng <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel controlId="category" label={<span>Loại <b className="text-danger">*</b></span>}>
                                                <Form.Select aria-label="Floating label select example">
                                                    <option>-- Nhấn để chọn --</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel controlId="status" label={<span>Trạng thái <b className="text-danger">*</b></span>}>
                                                <Form.Select aria-label="Floating label select example">
                                                    <option>-- Nhấn để chọn --</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating>
                                                <Form.Control type="text" placeholder="Xuất xứ" />
                                                <Form.Label htmlFor="country">Xuất xứ <b className="text-danger">*</b></Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Floating>
                                        <Form.Control as="textarea" style={{ height: '100px' }} />
                                        <Form.Label htmlFor="description" className="text-dark fs-5">Mô tả <b className="text-danger">*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <div className="text-center">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit">
                                            <input type="file" name="avatar" id="imageUpload" accept="image/jpeg, image/png" style={{ display: 'none' }} />
                                            <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                                        </div>

                                        <div className="avatar-preview">
                                            <div style={{ backgroundImage: `url("/images/avatar-init.gif")` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button style={{ backgroundColor: "#142239" }} onClick={handleSave}>Xác nhận</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Authority;
