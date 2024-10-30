import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";

interface SportFieldProps {
    showSportFieldModal: boolean;
    setShowSportFieldModal: (v: boolean) => void;
}

const ModalCreateSportField = (props: SportFieldProps) => {
    const { showSportFieldModal, setShowSportFieldModal } = props;

    // State cho các trường nhập liệu
    const [fieldName, setFieldName] = useState("");
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [selectedFieldType, setSelectedFieldType] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Hoạt động");
    const [image, setImage] = useState("/images/logo.png");

    // State cho danh sách loại sân
    const [fieldTypes, setFieldTypes] = useState([]);

    // Lấy danh sách loại sân từ API khi modal mở
    useEffect(() => {
        if (showSportFieldModal) {
            axios.get("http://localhost:8080/rest/category_field")
                .then(response => {
                    setFieldTypes(response.data);
                })
                .catch(error => {
                    console.error("Lỗi khi tải danh sách loại sân:", error);
                });
        }
    }, [showSportFieldModal]);

    // Đóng modal
    const handleClose = () => {
        setShowSportFieldModal(false);
    }

    const fieldNameRef = useRef<HTMLInputElement>(null);
    const openTimeRef = useRef<HTMLInputElement>(null);
    const closeTimeRef = useRef<HTMLInputElement>(null);
    const fieldTypeRef = useRef<HTMLSelectElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    // Lưu thông tin sân thể thao
    const handleSave = () => {
        // Kiểm tra từng trường và focus nếu trống
        if (!fieldName) {
            alert("Vui lòng nhập tên sân.");
            fieldNameRef.current?.focus();
            return;
        }
        if (!openTime) {
            alert("Vui lòng nhập giờ mở cửa.");
            openTimeRef.current?.focus();
            return;
        }
        if (!closeTime) {
            alert("Vui lòng nhập giờ đóng cửa.");
            closeTimeRef.current?.focus();
            return;
        }
        if (!selectedFieldType) {
            alert("Vui lòng chọn loại sân.");
            fieldTypeRef.current?.focus();
            return;
        }
        if (!address) {
            alert("Vui lòng nhập địa chỉ.");
            addressRef.current?.focus();
            return;
        }
        if (!description) {
            alert("Vui lòng nhập mô tả.");
            descriptionRef.current?.focus();
            return;
        }

        const sportFieldData = {
            name: fieldName,
            openTime: openTime,
            closeTime: closeTime,
            fieldType: selectedFieldType,
            address: address,
            description: description,
            image: image
        };

        // Gọi API để lưu thông tin sân
        axios.post("http://localhost:8080/rest/sportfield/create", sportFieldData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log("Thông tin sân đã được lưu:", response.data);
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi lưu thông tin sân:", error.response ? error.response.data : error.message);
            });
    }


    // Xử lý thay đổi ảnh
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    }

    return (
        <>
            <Modal show={showSportFieldModal} onHide={handleClose} size="xl" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase text-danger">Tạo sân thể thao</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col className="col-8">
                            <FloatingLabel controlId="floatingFieldName" label="Tên sân" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Tên sân"
                                    value={fieldName}
                                    onChange={(e) => setFieldName(e.target.value)}
                                />
                            </FloatingLabel>
                            <Row>
                                <Col className="col-6">
                                    <FloatingLabel controlId="floatingOpenTime" label="Giờ mở cửa" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Giờ mở cửa"
                                            value={openTime}
                                            onChange={(e) => setOpenTime(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col className="col-6">
                                    <FloatingLabel controlId="floatingCloseTime" label="Giờ đóng cửa" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Giờ đóng cửa"
                                            value={closeTime}
                                            onChange={(e) => setCloseTime(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="col-6">
                                    <FloatingLabel controlId="floatingFieldType" label="Loại sân" className="mb-3">
                                        <Form.Select
                                            aria-label="Loại sân"
                                            value={selectedFieldType}
                                            onChange={(e) => setSelectedFieldType(e.target.value)}
                                        >
                                            {fieldTypes.length > 0 ? (
                                                fieldTypes.map((type: any) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Đang tải...</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col className="col-6">
                                    <FloatingLabel controlId="floatingStatus" label="Trạng thái" className="mb-3">
                                        <Form.Select
                                            aria-label="Trạng thái"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="Hoạt động">Hoạt động</option>
                                            <option value="Tạm đóng">Tạm đóng</option>
                                            <option value="Sửa chữa">Sửa chữa</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <FloatingLabel controlId="floatingAddress" label="Địa chỉ" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Địa chỉ"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDescription" label="Mô tả" className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col className="col-4">
                            <img src={image} alt="Sport field" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                            <Form.Group controlId="formFile" className="mt-3">
                                <Form.Label>Sửa ảnh</Form.Label>
                                <Form.Control type="file" onChange={handleImageChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                    <Button variant="success" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalCreateSportField;
