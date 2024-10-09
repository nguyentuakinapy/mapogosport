import { Button, Col, Form, Modal, Row } from "react-bootstrap";

interface UserProps {
    showUpdateEmail: boolean;
    setShowUpdateEmail: (v: boolean) => void;
    email: string;
    setEmail: (v: string) => void;
}

const ModalUpdateEmail = (props: UserProps) => {
    const { showUpdateEmail, setShowUpdateEmail } = props;

    const handleClose = () => {
        setShowUpdateEmail(false);
    }

    const handleSave = () => {
        handleClose();
    }

    return (
        <>
            <Modal show={showUpdateEmail} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Cập nhật Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-verify">
                            <div className="border border-2 mb-2">
                                <Row>
                                    <Col xs={2}><i className="bi bi-envelope-at-fill fs-3 ms-4"></i></Col>
                                    <Col xs={10}>
                                        <div style={{ color: "#142239" }} className="fw-bold">Lấy mã xác nhận qua Email</div>
                                        <div className="fw-bold text-danger">Email: {props.email}</div>
                                    </Col>
                                </Row>
                            </div>
                            <Button style={{ width: "100%", background: "#142239" }} type="submit">Nhận mã</Button>
                        </div>
                        <div className="form-otp my-3">
                            <Form.Label>Mã xác nhận: <b className="text-danger">*</b></Form.Label>
                            <div className="align-items-center justify-content-between d-flex">
                                <Form.Control type="text" maxLength={1} />
                                <Form.Control type="text" maxLength={1} />
                                <Form.Control type="text" maxLength={1} />
                                <Form.Control type="text" maxLength={1} />
                                <Form.Control type="text" maxLength={1} />
                            </div>
                        </div>
                        <div className="form-change">
                            <Form.Group className="mt-3">
                                <Form.Label>Email mới: <b className="text-danger">*</b></Form.Label>
                                <Form.Control type="email" placeholder="Nhập email mới" />
                            </Form.Group>
                        </div>
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

export default ModalUpdateEmail;