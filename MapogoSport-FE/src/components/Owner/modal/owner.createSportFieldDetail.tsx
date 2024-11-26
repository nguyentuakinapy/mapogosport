import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface SportFieldDetailProps {
    showSportFieldDetailModal: boolean;
    setShowSportFieldDetailModal: (v: boolean) => void;
    selectedSportFieldDetail?: SportFieldDetail | null;
    id?: string | string[];
    owner?: Owner
}

const ModalCreateSportFieldDetail = (props: SportFieldDetailProps) => {
    const { showSportFieldDetailModal, setShowSportFieldDetailModal, selectedSportFieldDetail, id, owner } = props;
    const [fieldName, setFieldName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [peakHourPrices, setPeakHourPrices] = useState<number>(0);
    const [size, setSize] = useState("");
    const [status, setStatus] = useState("");
    const [percentDeposit, setPercentDeposit] = useState<number>(0);
    const [peakHour, setPeakHour] = useState("");

    useEffect(() => {
        if (showSportFieldDetailModal) {
            if (!selectedSportFieldDetail) {
                setFieldName("");
                setStatus("");
                setPrice(0);
                setPeakHourPrices(0);
                setSize("");
                setPercentDeposit(0);
                setPeakHour("");
            } else {
                setFieldName(selectedSportFieldDetail.name);
                setStatus(selectedSportFieldDetail.status);
                setPrice(selectedSportFieldDetail.price);
                setPeakHourPrices(selectedSportFieldDetail.peakHourPrices);
                setSize(selectedSportFieldDetail.size);
                setPercentDeposit(selectedSportFieldDetail.percentDeposit);
                setPeakHour(selectedSportFieldDetail.peakHour);
            }
        }
    }, [showSportFieldDetailModal, selectedSportFieldDetail]);

    // Đóng modal và reset các trường nhập liệu
    const handleClose = () => {
        setShowSportFieldDetailModal(false);
        setFieldName("");
        setStatus("");
        setPrice(0);
        setPeakHourPrices(0);
        setSize("");
        setPercentDeposit(0);
        setPeakHour("");
    };

    const handleSave = () => {
        if (!fieldName || !peakHour || !size || !status || !percentDeposit || !peakHourPrices || !price) {
            toast.error("Vui lòng điền đầy đủ thông tin sân.");
            return;
        }

        const SportFieldDetailData = {
            sportFieldId: id,
            name: fieldName,
            peakHour: peakHour,
            size: size,
            status: status,
            percentDeposit: percentDeposit,
            peakHourPrices: peakHourPrices,
            price: price
        };

        axios.post("http://localhost:8080/rest/sportFieldDetail/create", SportFieldDetailData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => {
            mutate(`http://localhost:8080/rest/sportfielddetail/lists/${id}`);
            mutate(`http://localhost:8080/rest/sport_field_by_owner/${owner?.ownerId}`);
            handleClose();
            toast.success("Thêm sân thành công!");
        }).catch(error => {
            console.error("Lỗi khi lưu thông tin sân:", error.response ? error.response.data : error.message);
        });
    };
    const handleUpdate = () => {
        if (!fieldName || !peakHour || !size || !status || !percentDeposit || !peakHourPrices || !price) {
            toast.error("Vui lòng điền đầy đủ thông tin sân.");
            return;
        }
        const SportFieldDetailData = {
            sportFieldDetailId: selectedSportFieldDetail?.sportFielDetailId,
            name: fieldName,
            peakHour: peakHour,
            size: size,
            status: status,
            percentDeposit: percentDeposit,
            peakHourPrices: peakHourPrices,
            price: price
        };
        axios.post("http://localhost:8080/rest/SportFieldDetail/update", SportFieldDetailData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => {
            mutate(`http://localhost:8080/rest/sportfielddetail/lists/${id}`);
            handleClose();
            toast.success("Cập nhật thành công!");
        }).catch(error => {
            console.error("Lỗi khi lưu thay đổi thông tin sân:", error.response ? error.response.data : error.message);
        });
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        const numericValue = rawValue === "" ? 0 : Number(rawValue);
        setPrice(numericValue);
    };

    const handlePeakPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        const numericValue = rawValue === "" ? 0 : Number(rawValue);
        setPeakHourPrices(numericValue);
    };

    return (
        <Modal show={showSportFieldDetailModal} size="lg" centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title className="d-flex m-auto fw-bold text-danger text-uppercase">{selectedSportFieldDetail ? 'Sửa sân' : 'Thêm sân'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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

                        <InputGroup className="mb-3">
                            <FloatingLabel controlId="floatingOpenTime" label="Giá thuê">
                                <Form.Control type="text" placeholder="Giá thuê"
                                    value={price.toLocaleString()}
                                    onChange={handlePriceChange} />
                            </FloatingLabel>
                            <InputGroup.Text style={{ fontSize: '15px', fontWeight: 700, border: '1px solid' }}>VNĐ</InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col className="col-6">
                        <InputGroup className="mb-3">
                            <FloatingLabel controlId="floatingCloseTime" label="Giá giờ vàng">
                                <Form.Control type="text" placeholder="Giá giờ vàng"
                                    value={peakHourPrices.toLocaleString()}
                                    onChange={handlePeakPriceChange} />
                            </FloatingLabel>
                            <InputGroup.Text style={{ fontSize: '15px', fontWeight: 700, border: '1px solid' }}>VNĐ</InputGroup.Text>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-6">
                        <FloatingLabel controlId="floatingStatus" label="Trạng thái" className="mb-3">
                            <Form.Select style={{ border: '1px solid' }} value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Chọn trạng thái</option>
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Tạm đóng">Tạm đóng</option>
                                <option value="Sửa chữa">Sửa chữa</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col className="col-6">
                        <FloatingLabel controlId="floatingStatus" label="Kích thước" className="mb-3">
                            <Form.Select style={{ border: '1px solid' }} value={size} onChange={(e) => setSize(e.target.value)}>
                                <option value="">Chọn kích thước</option>
                                <option value="5 người">5 người</option>
                                <option value="7 người">7 người</option>
                                <option value="11 người">11 người</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>

                </Row>
                <Row>
                    <Col className="col-6">
                        <FloatingLabel controlId="floatingOpenTime" label="Phần trăm cọc (0-100)" className="mb-3">
                            <Form.Control
                                type="number"
                                placeholder="Phần trăm cọc"
                                value={percentDeposit}
                                onChange={(e) => {
                                    const value = Math.max(0, Math.min(100, Number(e.target.value))); // Giới hạn giá trị từ 0 đến 100
                                    setPercentDeposit(value);
                                }}
                            />

                        </FloatingLabel>
                    </Col>
                    <Col>
                        <Form.Group controlId="goldenHourStart">
                            <FloatingLabel controlId="floatingOpenTime" label="Khung giờ vàng (0h-24h hoặc 0h30-24h30)" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    value={peakHour}
                                    onChange={(e) => setPeakHour(e.target.value)}
                                    onBlur={() => {
                                        const regex = /^([01]?[0-9]|2[0-4])h([0-5]?[0-9])?-(?:[01]?[0-9]|2[0-4])h([0-5]?[0-9])?$/;

                                        if (!regex.test(peakHour)) {
                                            alert("Vui lòng nhập khung giờ theo định dạng '(0-24)h(00-59)-(0-24)h(00-59)'");
                                            setPeakHour(""); // Xóa giá trị nếu không hợp lệ
                                        }
                                    }}
                                />
                            </FloatingLabel>


                        </Form.Group>
                    </Col>

                </Row>
            </Modal.Body >
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button style={{ background: '#142239' }} onClick={selectedSportFieldDetail ? handleUpdate : handleSave}>
                    {selectedSportFieldDetail ? 'Lưu Thay Đổi' : 'Thêm sân'}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalCreateSportFieldDetail;
