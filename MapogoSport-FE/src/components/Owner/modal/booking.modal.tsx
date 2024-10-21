import { formatPrice } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR from "swr";

interface OwnerProps {
    showBookingModal: boolean;
    setShowBookingModal: (v: boolean) => void;
    sportDetail?: SportFieldDetail;
    timeStart: string;
    dayStartBooking: string;
    sport?: SportField;
}

const BookingModal = (props: OwnerProps) => {
    const { showBookingModal, setShowBookingModal, sportDetail, timeStart, dayStartBooking, sport } = props;

    const [selectTime, setSelectTime] = useState<string>("1h");
    const [isOffline, setIsOffline] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[]>();


    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        `http://localhost:8080/rest/paymentMethod`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    // BOOKING
    const [username, setUsername] = useState<string>();
    const [totalAmount, setTotalAmount] = useState<number>();
    const [status, setStatus] = useState<string>();
    const [paymentMethodId, setPaymentMethodId] = useState<number>(0);
    const [owner, setOwner] = useState<number>();
    const [note, setNote] = useState<string | null>(null);

    // BOOKING DETAIL
    useEffect(() => {
        setPaymentMethod(data);
    }, [data])

    useEffect(() => {
        // console.log(paymentMethod);
    }, [paymentMethod])

    const handleClose = () => {
        setShowBookingModal(false);
    }

    const handleSave = () => {
        if (isOffline) {
            toast.success("Đang đặt sân offline.");
        } else {
            toast.success("Đang đặt sân online.");
        }
    }

    return (
        <>
            <Modal show={showBookingModal} onHide={() => handleClose()} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">đặt Sân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin {sportDetail && sportDetail.name}</h6>
                            <ul>
                                <li><span className="fw-bold">Giá đặt sân / 1h:</span> {formatPrice(sportDetail && sportDetail.price)}.</li>
                                <li><span className="fw-bold">Giá đặt sân giờ vàng / 1h:</span> {formatPrice(sportDetail && sportDetail.peakHourPrices)}.</li>
                                <li><span className="fw-bold">Giờ vàng:</span> {sportDetail && sportDetail.peakHour}.</li>
                                <li><span className="fw-bold">Kích thước sân:</span> {sportDetail && sportDetail.size}.</li>
                                <li><span className="fw-bold">Trạng thái:</span> {sport && sport.status}.</li>
                                <li><span className="fw-bold">Địa chỉ:</span> {sport && sport.address}.</li>
                            </ul>
                        </Col>
                        <Col>
                            <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</h6>
                            <InputGroup className="mb-2">
                                <Form.Control disabled={isOffline}
                                    type="text"
                                    placeholder="Vui lòng nhập tên đăng nhập!"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <InputGroup.Text aria-label="Checkbox for following text input bg-white">
                                    <Form.Check
                                        type="checkbox"
                                        label="Offline"
                                        checked={isOffline}
                                        onChange={(e) => setIsOffline(e.target.checked)}
                                    />
                                </InputGroup.Text>
                            </InputGroup>
                            <select value={selectTime} onChange={(e) => setSelectTime(e.target.value)}
                                className="form-select mb-2" aria-label="Default select example">
                                <option value="1h">1h</option>
                                <option value="1h30">1h30p</option>
                            </select>
                            <select value={paymentMethodId}
                                onChange={(e) => setPaymentMethodId(Number(e.target.value))}
                                className="form-select" aria-label="Default select example">
                                <option value={"0"}
                                >Phương thức thanh toán *</option>
                                {paymentMethod && (
                                    paymentMethod.map((item) => (
                                        <option key={item.paymentMethodId} value={item.paymentMethodId}>{item.name}</option>
                                    ))
                                )}
                            </select>
                        </Col>
                    </Row>
                    <h6 className="text-uppercase text-danger fw-bold text-center my-2">Thông tin đặt sân</h6>
                    <Row>
                        <Col className="px-5 text-center">
                            <span><b> Ngày đặt: </b>{dayStartBooking}. </span><br />
                            <span><b> Giờ bắt đầu: </b>{timeStart}. </span><br />
                            <span><b> Giờ kết thúc: </b>{timeStart}.</span>
                        </Col>
                        <Col className="px-5 text-center">
                            <span><b>Đơn giá: </b> <em className="text-danger">120000đ</em>. </span><br />
                            <span><b>Tổng tiền: </b><em className="text-danger">200000đ</em>. </span><br />
                        </Col>
                    </Row>
                    <Form.Group className="mt-3 px-4">
                        <Form.Control as="textarea" rows={3}
                            type="text"
                            placeholder="Ghi chú!"
                        // value={username}
                        // onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
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

export default BookingModal;