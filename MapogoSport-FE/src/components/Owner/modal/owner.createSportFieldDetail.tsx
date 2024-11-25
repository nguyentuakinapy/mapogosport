import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { mutate } from "swr";


interface SportFieldDetailProps {
    showSportFieldDetailModal: boolean;
    setShowSportFieldDetailModal: (v: boolean) => void;
    selectedSportFieldDetail: any; // Thay thế `any` bằng kiểu dữ liệu cụ thể nếu có
    setSelectedSportFieldDetail: (field: any) => void;
    id: number | undefined; // Thêm id vào props và xác định kiểu dữ liệu
    owner?: Owner
}

const ModalCreateSportFieldDetail = (props: SportFieldDetailProps) => {
    const { showSportFieldDetailModal, setShowSportFieldDetailModal, selectedSportFieldDetail, id, owner } = props;

    const [fieldName, setFieldName] = useState("");
    const [price, setPrice] = useState<number | null>(null);
    const [peakHourPrices, setPeakHourPrices] = useState<number | null>(null);
    const [size, setSize] = useState("");
    const [status, setStatus] = useState("");
    const [percentDeposit, setPercentDeposit] = useState("");
    const [peakHour, setPeakHour] = useState("");

    useEffect(() => {
        if (showSportFieldDetailModal) {
            if (!selectedSportFieldDetail) {
                setFieldName("");
                setStatus("");
                setPrice(null);
                setPeakHourPrices(null);
                setSize("");
                setPercentDeposit("");
                setPeakHour("");
                setDisplayPeakPrice('');
                setDisplayPrice('');
            } else {
                setFieldName(selectedSportFieldDetail.name);
                setStatus(selectedSportFieldDetail.status);
                setPrice(selectedSportFieldDetail.price);
                setPeakHourPrices(selectedSportFieldDetail.peakHourPrices);
                setSize(selectedSportFieldDetail.size);
                setPercentDeposit(selectedSportFieldDetail.percentDeposit);
                setPeakHour(selectedSportFieldDetail.peakHour);
                setDisplayPeakPrice(selectedSportFieldDetail.peakHourPrices);
                setDisplayPrice(selectedSportFieldDetail.price);
            }
        }
    }, [showSportFieldDetailModal, selectedSportFieldDetail]);

    // Đóng modal và reset các trường nhập liệu
    const handleClose = () => {
        setShowSportFieldDetailModal(false);
        setFieldName("");
        setStatus("");
        setPrice(null);
        setPeakHourPrices(null);
        setSize("");
        setPercentDeposit("");
        setPeakHour("");
        setDisplayPeakPrice('');
        setDisplayPrice('');
    };

    const checkForm = () => {
        const errors = []; // Mảng lưu trữ thông báo lỗi

        if (!fieldName) {
            errors.push("Vui lòng điền tên sân.");
        }
        if (!peakHour) {
            errors.push("Vui lòng nhập khung giờ vàng.");
        }
        if (!size) {
            errors.push("Vui lòng điền kích thước.");
        }
        if (!status) {
            errors.push("Vui lòng chọn trạng thái.");
        }
        if (percentDeposit === null || percentDeposit === "") { // Kiểm tra cho giá trị null hoặc chuỗi rỗng
            errors.push("Vui lòng nhập phần trăm cọc.");
        }
        if (peakHourPrices === null || peakHourPrices === null) { // Kiểm tra cho giá trị null hoặc chuỗi rỗng
            errors.push("Vui lòng nhập giá giờ vàng.");
        }
        if (price === null || price === null) { // Kiểm tra cho giá trị null hoặc chuỗi rỗng
            errors.push("Vui lòng nhập giá thuê.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n")); // Hiển thị tất cả các lỗi
            return false; // Trả về false nếu có lỗi
        }

        return true; // Trả về true nếu không có lỗi
    }
    const handleSave = () => {
        if (!checkForm()) return; // Chỉ lưu khi `checkForm()` trả về true

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
        })
            .then(response => {
                console.log("Thông tin sân đã được lưu:", response.data);
                mutate(`http://localhost:8080/rest/sportfielddetail/lists/${id}`);
                mutate(`http://localhost:8080/rest/sport_field_by_owner/${owner?.ownerId}`);
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi lưu thông tin sân:", error.response ? error.response.data : error.message);
            });
    };
    const handleUpdate = () => {
        if (!checkForm()) return; // Chỉ lưu khi `checkForm()` trả về true

        const SportFieldDetailData = {
            sportFieldDetailId: selectedSportFieldDetail.sportFielDetailId,
            name: fieldName,
            peakHour: peakHour,
            size: size,
            status: status,
            percentDeposit: percentDeposit,
            peakHourPrices: peakHourPrices,
            price: price
        };
        console.log(selectedSportFieldDetail);

        console.log(SportFieldDetailData.sportFieldDetailId);

        axios.post("http://localhost:8080/rest/SportFieldDetail/update", SportFieldDetailData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log("Thông tin sân đã được lưu thay đổi:", response.data);
                mutate(`http://localhost:8080/rest/sportfielddetail/lists/${id}`);
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi lưu thay đổi thông tin sân:", error.response ? error.response.data : error.message);
            });
    }
    const [displayPrice, setDisplayPrice] = useState<string>("");
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
        const numericValue = Number(rawValue);

        // Cập nhật giá trị số vào state `price`
        setPrice(numericValue);

        // Cập nhật hiển thị dạng tiền tệ vào `displayPrice`
        setDisplayPrice(
            new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numericValue)
        );
    };

    const [displayPeakPrice, setDisplayPeakPrice] = useState<string>("");
    const handlePeakPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
        const numericValue = Number(rawValue);

        // Cập nhật giá trị số vào state `price`
        setPeakHourPrices(numericValue);

        // Cập nhật hiển thị dạng tiền tệ vào `displayPrice`
        setDisplayPeakPrice(
            new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numericValue)
        );
    };
    return (
        <Modal show={showSportFieldDetailModal} onHide={handleClose} size="lg" centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedSportFieldDetail ? 'Sửa sân' : 'Thêm sân'}</Modal.Title>
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
                        <FloatingLabel controlId="floatingOpenTime" label="Giá thuê" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Giá thuê"
                                value={displayPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                onChange={handlePriceChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col className="col-6">
                        <FloatingLabel controlId="floatingCloseTime" label="Giá giờ vàng" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Giá giờ vàng"
                                value={displayPeakPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                onChange={handlePeakPriceChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-6">
                        <FloatingLabel controlId="floatingStatus" label="Trạng thái" className="mb-3">
                            <Form.Select
                                aria-label="Trạng thái"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Chọn trạng thái</option>
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Tạm đóng">Tạm đóng</option>
                                <option value="Sửa chữa">Sửa chữa</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col className="col-6">
                        <FloatingLabel controlId="floatingStatus" label="Kích thước" className="mb-3">
                            <Form.Select
                                aria-label=""
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
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
                <Button variant="success" onClick={selectedSportFieldDetail ? handleUpdate : handleSave}>
                    {selectedSportFieldDetail ? 'Lưu Thay Đổi' : 'Thêm sân'}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalCreateSportFieldDetail;
