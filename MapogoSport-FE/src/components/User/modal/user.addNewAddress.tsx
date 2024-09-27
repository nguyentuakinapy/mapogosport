import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";

interface UserProps {
    showAddAddress: boolean;
    setShowAddAddress: (v: boolean) => void;
}

const ModalAddAddress = (props: UserProps) => {
    const { showAddAddress, setShowAddAddress } = props;

    const handleClose = () => {
        setShowAddAddress(false);
    }

    const handleSave = () => {
        handleClose();
    }

    return (
        <>
            <Modal show={showAddAddress} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Thêm địa chỉ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="city" label={<span>Tỉnh/Thành <b className="text-danger">*</b></span>}>
                                        <Form.Select aria-label="Floating label select example">
                                            <option>-- Nhấn để chọn --</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="ward" label={<span>Phường/Xã <b className="text-danger">*</b></span>}>
                                        <Form.Select aria-label="Floating label select example">
                                            <option>-- Nhấn để chọn --</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="district" label={<span>Quận/Huyện <b className="text-danger">*</b></span>}>
                                        <Form.Select aria-label="Floating label select example">
                                            <option>-- Nhấn để chọn --</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Floating>
                                        <Form.Control size="sm" type="text" placeholder="Số điện thoại" />
                                        <Form.Label htmlFor="phone">Số điện thoại <b className="text-danger">*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Floating>
                                <Form.Control size="sm" type="text"
                                    placeholder="Địa chỉ chi tiết"
                                // value={name} onChange={(e) => setName(e.target.value)}
                                />
                                <Form.Label htmlFor="detailAddress">Địa chỉ chi tiết <b className='text-danger'>*</b></Form.Label>
                            </Form.Floating>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Hủy
                    </Button>
                    <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default ModalAddAddress;