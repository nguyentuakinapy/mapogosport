import { Button, Col, Form, Modal, Row } from "react-bootstrap";

interface UserProps {
    showUpdatePhone: boolean;
    setShowUpdatePhone: (v: boolean) => void;
}

const ModalUpdatePhone = (props: UserProps) => {
    const { showUpdatePhone, setShowUpdatePhone } = props;

    const handleClose = () => {
        setShowUpdatePhone(false);
    }

    const handleSave = () => {
        handleClose();
    }

    return (
        <>
            <Modal show={showUpdatePhone} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Cập nhật số điện thoại</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-verify">
                            <Form.Group className="mt-3">
                                <Form.Label>Số điện thoại mới: <b className="text-danger">*</b></Form.Label>
                                <Form.Control type="text" placeholder="Nhập số điện thoại" />
                                <Button style={{ width: "100%", background: "#142239" }} type="submit" className="mt-3">Nhận mã</Button>
                            </Form.Group>
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

export default ModalUpdatePhone;