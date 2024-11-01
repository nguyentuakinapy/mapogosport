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
    startTimeKey: boolean
}

const BookingModal = (props: OwnerProps) => {
    const { showBookingModal, setShowBookingModal, sportDetail, startTime,
        dayStartBooking, sport, owner, checkDataStatus, setCheckDataStatus, startTimeKey } = props;

    const [selectTime, setSelectTime] = useState<string>('Chọn thời gian');
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
    const [username, setUsername] = useState<string>("");
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

    const [operatingTime, setOperatingTime] = useState<number>(0);
    const [operatingTimeFetchData, setOperatingTimeFetchData] = useState<number>(0);
    const [dataTime, setDataTime] = useState<String[]>();

    useEffect(() => {
        checkTimeBooking();
    }, [operatingTime]);

    const checkTimeBooking = async () => {
        if (!startTime || !dayStartBooking) return;

        const newData = [startTime];
        for (let i = 0; i < operatingTime * 2; i++) {
            const getTime = newData[i].match(/\d+/);
            if (getTime) {
                const hour = Number(getTime[0]);
                newData.push(newData[i].includes("h30") ? `${hour + 1}h00` : `${hour}h30`);
            }
        }

        let count = 0;
        for (const time of newData) {
            if (count >= 6) {
                setOperatingTimeFetchData(6);
                break;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/rest/booking/detail/findbystarttime/sportfielddetail/${time}/${sportDetail?.sportFielDetailId}/${dayStartBooking}`
                );

                if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
                const text = await response.text();

                if (text) {
                    const dataBooking = JSON.parse(text);
                    if (dataBooking && Object.keys(dataBooking).length > 0) {
                        setOperatingTimeFetchData(count);
                        break;
                    }
                } else {
                    setOperatingTimeFetchData(count);
                }
            } catch (error) {
                console.error("API or JSON parsing error:", error);
            }
            count++;
        }
    };

    useEffect(() => {
        getTime();
    }, [startTimeKey]);

    const getTime = () => {
        if (startTime && typeof startTime === 'string' && sport?.closing && typeof sport?.closing === 'string') {
            const [openHour, openMinute] = startTime.split("h").map(Number);
            const [closeHour, closeMinute] = sport.closing.split("h").map(Number);

            if (openHour !== undefined && openMinute !== undefined && closeHour !== undefined && closeMinute !== undefined) {
                const totalOpenMinutes = openHour * 60 + openMinute;
                const totalCloseMinutes = closeHour * 60 + closeMinute;

                const operatingTimeInHours = (totalCloseMinutes - totalOpenMinutes) / 60;

                setOperatingTime(operatingTimeInHours);
            } else {
                // console.log('Không thể tách giờ và phút.');

            }
        } else {
            // console.log('Giá trị giờ không hợp lệ.');
        }
    };


    useEffect(() => {
        createDataTime();
    }, [operatingTimeFetchData])


    const createDataTime = () => {
        const newData: string[] = [];

        const timeIntervals = [];

        for (let hours = 0; hours <= 24; hours++) {
            for (let minutes = 0; minutes <= 30; minutes += 30) {
                if (hours === 0 && minutes === 0) continue; // Bỏ qua 0 giờ 0 phút

                let label: string;

                if (hours === 0 && minutes > 0) {
                    label = `${minutes} phút`;
                } else if (minutes === 0) {
                    label = `${hours} giờ`;
                } else {
                    label = `${hours} giờ ${minutes} phút`;
                }

                timeIntervals.push({ label, value: hours + minutes / 60 });
            }
        }
        for (let index = 0; index < operatingTimeFetchData; index++) {
            newData.push(timeIntervals[index].label);
        }
        setDataTime(newData);
    }

    useEffect(() => {
        getPriceByTimeBooking();
    }, [selectTime]);

    const getPriceByTimeBooking = () => {
        if (selectTime == 'Chọn thời gian') {
            setPrice(0);
            setEndTime("");
            return;
        }
        if (selectTime && startTime) {
            const getTime = startTime.match(/(\d+)h(\d+)/);
            const hours = getTime ? Number(getTime[1]) : 0;
            const minutes = getTime ? Number(getTime[2]) : 0;

            let endHour = hours;
            let endMinute = minutes;

            const selectedTime = dataTime && dataTime.find(item => item === selectTime);
            if (selectedTime) {
                const timeParts = selectedTime.split(' ');

                let hoursToAdd = 0;
                let minutesToAdd = 0;

                for (let i = 0; i < timeParts.length; i++) {
                    if (timeParts[i].includes('giờ')) {
                        hoursToAdd += Number(timeParts[i - 1]); // Cộng dồn số giờ
                    }

                    if (timeParts[i].includes('phút')) {
                        minutesToAdd += Number(timeParts[i - 1]); // Cộng dồn số phút
                    }
                }

                endHour += hoursToAdd;
                endMinute += minutesToAdd;

                if (endMinute >= 60) {
                    endHour += Math.floor(endMinute / 60);
                    endMinute = endMinute % 60;
                }

                setEndTime(`${endHour}h${endMinute > 0 ? endMinute : '00'}`);
                // toast.success(`${endHour}h${endMinute > 0 ? endMinute : '00'}`);

                const selectedPrice = sportDetail?.price || 0; // giá cơ bản cho mỗi giờ
                let totalAmount = 0;

                let totalTimeInHours: number = 0;
                if (startTime.includes("h30")) {
                    totalTimeInHours = Math.abs(endHour - hours) + (endMinute / 60) - 0.5; // Thời gian từ giờ bắt đầu đến giờ kết thúc
                    if (totalTimeInHours == 0.5) {
                        totalAmount = selectedPrice / 2;
                    } else if (String(totalTimeInHours).includes(".5")) {
                        totalAmount = (selectedPrice * Math.abs(endHour - hours)) - selectedPrice / 2;
                    } else {
                        totalAmount = selectedPrice * totalTimeInHours;
                    }
                } else {
                    totalTimeInHours = (Math.abs(endHour - hours) + (endMinute / 60)); // Thời gian từ giờ bắt đầu đến giờ kết thúc
                    if (totalTimeInHours == 0.5) {
                        totalAmount = selectedPrice / 2;
                    } else if (String(totalTimeInHours).includes(".5")) {
                        if (String(totalTimeInHours).includes("1")) {
                            totalAmount = (selectedPrice * Math.abs(endHour - hours)) + selectedPrice / 2;
                        } else {
                            totalAmount = (selectedPrice * Math.abs(endHour - hours)) + selectedPrice / 2;
                        }
                    } else {
                        totalAmount = selectedPrice * totalTimeInHours;
                    }
                }
                setPrice(totalAmount);
                setTotalAmount(totalAmount);
                setDate(dayStartBooking);
            }
        }
    }


    const handleClose = () => {
        setShowBookingModal(false);
        setUsername("");
        setOperatingTime(0);
        setOperatingTimeFetchData(0);
        // setPrice(0);
        // setEndTime("");
        setSelectTime("Chọn thời gian");
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
                toast.error('Tên người dùng không tồn tại!');
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

        toast.success("Đặt sân thành công!");
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
                                <FloatingLabel controlId="floatingUsername" label="Vui lòng nhập tên đăng nhập!" className="flex-grow-1">
                                    <Form.Control
                                        type="text"
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled={isOffline}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </FloatingLabel>

                                <InputGroup.Text aria-label="Checkbox for following text input bg-white">
                                    <Form.Check
                                        type="checkbox"
                                        label="Offline"
                                        checked={isOffline}
                                        onChange={(e) => setIsOffline(e.target.checked)}
                                    />
                                </InputGroup.Text>
                            </InputGroup>

                            <FloatingLabel controlId="floatingSelectTime" label="Chọn thời gian" className="mb-2">
                                <Form.Select
                                    value={selectTime}
                                    onChange={(e) => setSelectTime(e.target.value)}
                                    aria-label="Default select example"
                                >
                                    <option value="Chọn thời gian">Chọn thời gian</option>
                                    {dataTime && dataTime.map((time, index) => (
                                        <option key={index} value={String(time)}>{time}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingPaymentMethod" label="Phương thức thanh toán *">
                                <Form.Select
                                    value={paymentMethodId}
                                    onChange={(e) => setPaymentMethodId(Number(e.target.value))}
                                    aria-label="Default select example"
                                >
                                    <option value="0">Phương thức thanh toán *</option>
                                    {dataPaymentMethod && dataPaymentMethod.map((item) => (
                                        <option key={item.paymentMethodId} value={item.paymentMethodId}>{item.name}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <h6 className="text-uppercase text-danger fw-bold text-center my-2">Thông tin đặt sân</h6>
                    <Row>
                        <Col className="px-5 text-center">
                            <span><b> Ngày đặt: </b>{dayStartBooking}. </span><br />
                            <span><b> Thời gian đá: </b>{startTime} - {endTime ? endTime : '???'}</span><br />
                        </Col>
                        <Col className="px-5 text-center">
                            <span><b>Đơn giá: </b> <em className="text-danger">{sportDetail?.price.toLocaleString("vi-VN", { style: "currency", currency: "VND", })}</em>. </span><br />
                            <span><b>Tổng tiền: </b><em className="text-danger">{price ? price.toLocaleString("vi-VN", { style: "currency", currency: "VND", }) : '???'}</em>. </span><br />
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