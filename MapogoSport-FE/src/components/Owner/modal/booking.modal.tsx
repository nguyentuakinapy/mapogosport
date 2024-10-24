import { formatPrice } from "@/components/Utils/Format";
import { use, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface OwnerProps {
    showBookingModal: boolean;
    setShowBookingModal: (v: boolean) => void;
    sportDetail?: SportFieldDetail;
    startTime: string;
    dayStartBooking: string;
    sport?: SportField;
    owner?: Owner;
    checkDataStatus: boolean
    setCheckDataStatus: (v: boolean) => void;
}

const BookingModal = (props: OwnerProps) => {
    const { showBookingModal, setShowBookingModal, sportDetail, startTime, dayStartBooking, sport, owner, checkDataStatus, setCheckDataStatus } = props;

    const [selectTime, setSelectTime] = useState<string>("Chọn thời gian");
    const [isOffline, setIsOffline] = useState(false);

    const [booking, setBooking] = useState<Booking>();

    const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethod[]>();


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
    const [statusBooking, setStatusBooking] = useState<string>("Đã thanh toán");
    const [paymentMethodId, setPaymentMethodId] = useState<number>(0);
    const [note, setNote] = useState<string>("");

    // BOOKING DETAIL
    const [endTime, setEndTime] = useState<string>();
    const [price, setPrice] = useState<number>();
    const [date, setDate] = useState<string>();

    // BOOKING PAYMENT
    const [amount, setAmount] = useState<number>();
    const [statusPayment, setStatusPayment] = useState<string>("0");
    const [referenceCode, setReferenceCode] = useState<string>("0");

    useEffect(() => {
        setDataPaymentMethod(data);
    }, [data])

    useEffect(() => {
        if (selectTime == '1h') {
            if (startTime.includes("h30")) {
                const getTime = startTime.match(/\d+/);
                if (getTime) {
                    setEndTime(String(Number(getTime[0]) + 1) + "h30");
                }
            } else {
                const getTime = startTime.match(/\d+/);
                if (getTime) {
                    setEndTime(String(Number(getTime[0]) + 1) + "h00");
                }
            }
            setPrice(sportDetail && sportDetail?.price);
            setTotalAmount(sportDetail && sportDetail?.price);
            setDate(dayStartBooking);
        } else if (selectTime == '1h30') {
            if (startTime.includes("h30")) {
                const getTime = startTime.match(/\d+/);
                if (getTime) {
                    setEndTime(String(Number(getTime[0]) + 2) + "h00");
                }
            } else {
                const getTime = startTime.match(/\d+/);
                if (getTime) {
                    setEndTime(String(Number(getTime[0]) + 1) + "h30");
                }
            }
            setPrice(sportDetail && sportDetail.price + (sportDetail.price / 2));
            setTotalAmount(sportDetail && sportDetail.price + (sportDetail.price / 2));
            setDate(dayStartBooking);
        } else if (selectTime == '2h') {
            if (startTime.includes("h30")) {
                const getTime = startTime.match(/\d+/);
                if (getTime) {
                    setEndTime(String(Number(getTime[0]) + 2) + "h30");
                }
            } else {
                const getTime = startTime.match(/\d+/);
                if (getTime) {
                    setEndTime(String(Number(getTime[0]) + 2) + "h00");
                }
            }
            setPrice(sportDetail && sportDetail.price + sportDetail.price);
            setTotalAmount(sportDetail && sportDetail.price + sportDetail.price);
            setDate(dayStartBooking);
        } else {
            setPrice(0);
            setEndTime("0");
        }
    }, [selectTime])

    const handleClose = () => {
        setShowBookingModal(false);
    }

    const handleSave = async () => {
        const paymentMethod = dataPaymentMethod?.find(method => method.paymentMethodId === paymentMethodId);
        if (!paymentMethod) {
            toast.error("Phương thức thanh toán không hợp lệ!");
            return;
        }
        if (isOffline) {
            const responseUser = await fetch(`http://localhost:8080/rest/user/sportoffline`);
            if (!responseUser.ok) {
                throw new Error('Error fetching data');
            }
            const dataUser = await responseUser.json() as User;
            createBooking(paymentMethod, dataUser);
        } else {
            const responseUser = await fetch(`http://localhost:8080/rest/user/${username}`);
            if (!responseUser.ok) {
                toast.error('Error fetching data');
                return;
            }
            const dataUser = await responseUser.json() as User;
            createBooking(paymentMethod, dataUser);
        }
        setCheckDataStatus(!checkDataStatus);
        handleClose();
    }

    const createBooking = async (paymentMethod: PaymentMethod, dataUser: User) => {
        if (!owner) {
            toast.error("Thông tin chủ sở hữu không hợp lệ!");
            return;
        }
        if (!sportDetail) {
            toast.error("Thông tin sân không hợp lệ!");
            return;
        }
        const responseBooking = await fetch('http://localhost:8080/rest/booking', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json' // Không cần charset=UTF-8
            },
            body: JSON.stringify({
                username: dataUser.username,
                totalAmount,
                paymentMethodId: paymentMethod.paymentMethodId,
                ownerId: owner.ownerId,
                status: statusBooking,
                voucher: null,
                note
            })
        })

        const resBooking = await responseBooking.json() as Booking;

        const responseBookingDetail = await fetch('http://localhost:8080/rest/booking/detail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTime,
                endTime,
                sportFieldDetailId: sportDetail.sportFielDetailId,
                price,
                date: dayStartBooking,
                booking: resBooking.bookingId
            })
        });
        const resBookingDetail = await responseBookingDetail.json() as BookingDetail;

        toast.success("Đặt sân thành công!" + resBooking.bookingId + " - " + resBookingDetail.bookingDetailId);
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
                                <option value="Chọn thời gian">Chọn thời gian</option>
                                <option value="1h">1h00</option>
                                <option value="1h30">1h30p</option>
                                <option value="2h">2h00</option>
                            </select>
                            <select value={paymentMethodId}
                                onChange={(e) => setPaymentMethodId(Number(e.target.value))}
                                className="form-select" aria-label="Default select example">
                                <option value={"0"}
                                >Phương thức thanh toán *</option>
                                {dataPaymentMethod && (
                                    dataPaymentMethod.map((item) => (
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
                            <span><b> Giờ bắt đầu: </b>{startTime}. </span><br />
                            <span><b> Giờ kết thúc: </b>{endTime}.</span>
                        </Col>
                        <Col className="px-5 text-center">
                            <span><b>Đơn giá: </b> <em className="text-danger">{formatPrice(sportDetail?.price)}</em>. </span><br />
                            <span><b>Tổng tiền: </b><em className="text-danger">{formatPrice(price)}</em>. </span><br />
                        </Col>
                    </Row>
                    <Form.Group className="mt-3 px-4">
                        <Form.Control as="textarea" rows={3}
                            type="text"
                            placeholder="Ghi chú!"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
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