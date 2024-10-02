import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";

interface UserProps {
    showAddVoucher: boolean;
    setShowAddVoucher: (v: boolean) => void;
}

const VoucherAddNew = (props: UserProps) => {
    const { showAddVoucher, setShowAddVoucher } = props;

    const handleClose = () => {
        setShowAddVoucher(false);
    }

    const handleSave = () => {
        handleClose();
    }

    return (
        <>
            <Modal show={showAddVoucher} onHide={() => handleClose()}
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Tạo Voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Floating>
                                        <Form.Control type="text" placeholder="Mã code" />
                                        <Form.Label htmlFor="name">Mã Code <b className="text-danger">*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Floating>
                                        <Form.Control type="number" placeholder="Số lượng" />
                                        <Form.Label htmlFor="quantity">Số lượng <b className="text-danger">*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Floating>
                                        <Form.Control type="number" placeholder="Phần trăm giảm" />
                                        <Form.Label htmlFor="discount">Giảm (%)<b className="text-danger">*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Floating>
                                        <Form.Control type="number" placeholder="Số điện thoại" />
                                        <Form.Label htmlFor="expried">Số ngày dùng <b className="text-danger">*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>
                            </Col>
                        </Row>
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

export default VoucherAddNew;