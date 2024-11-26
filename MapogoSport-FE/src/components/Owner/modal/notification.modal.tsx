import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

interface OwnerProps {
    showNotificationModal: boolean;
    setNotificationModal: (v: boolean) => void;
    renderNotification: () => ReactNode;
    textHeadNotification: string;
    size?: string
}

const NotificationModal = (props: OwnerProps) => {
    const { showNotificationModal, setNotificationModal, renderNotification, textHeadNotification } = props;


    const handleClose = () => {
        setNotificationModal(false);
    }

    return (
        <>
            <Modal show={showNotificationModal} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">{textHeadNotification}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderNotification()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default NotificationModal;