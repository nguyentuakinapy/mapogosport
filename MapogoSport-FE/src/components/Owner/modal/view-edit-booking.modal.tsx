import { formatPrice } from "@/components/Utils/Format";
import { use, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { safeMultipleDatesFormat } from "react-datepicker/dist/date_utils";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface OwnerProps {
    showViewOrEditBookingModal: boolean;
    setShowViewOrEditBookingModal: (v: boolean) => void;
    owner?: Owner;
    checkDataStatus: boolean
    setCheckDataStatus: (v: boolean) => void;
    startTimeKey: boolean;
    bookingDetailData?: BookingDetail;
    userData?: User;
    paymentMethod?: PaymentMethod
    sport?: SportField;
    bookingBySubscriptionKey?: BookingDetail[];

}

const BookingModal = (props: OwnerProps) => {
    const { showViewOrEditBookingModal, setShowViewOrEditBookingModal, paymentMethod, sport, bookingBySubscriptionKey
        , owner, checkDataStatus, setCheckDataStatus, startTimeKey, bookingDetailData, userData } = props;

    const [editBooking, setEditBooking] = useState<boolean>(true);
    const [dateBooking, setDateBooking] = useState<string>();
    const [idSportDetail, setIdSportDetail] = useState<number>();
    const [startTimeBooking, setStartTimeBooking] = useState<string>();
    const [endTimeBooking, setEndTimeBooking] = useState<string>();
    const [confirmData, setConfirmData] = useState<boolean>(false);
    const [applyOne, setApplyOne] = useState<boolean>(true);
    const today = new Date().toISOString().split("T")[0];


    useEffect(() => {
        setDateBooking(bookingDetailData?.date);
        setStartTimeBooking(bookingDetailData?.startTime);
        setEndTimeBooking(bookingDetailData?.endTime);
        setIdSportDetail(bookingDetailData?.sportFieldDetail.sportFielDetailId);
    }, [bookingDetailData])

    const handleCancelBookingDetail = () => {
        if (applyOne) {
            fetch(`http://localhost:8080/rest/booking/update/status/${bookingDetailData?.bookingDetailId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Hủy sân không thành công!`);
                    return
                }
                setCheckDataStatus(!checkDataStatus);
                handleClose();
                toast.success('Hủy sân thành công!');
            })
        } else {
            fetch(`http://localhost:8080/rest/booking/update/status/by/subcriptionKey/${bookingDetailData?.bookingDetailId}/${bookingDetailData?.subcriptionKey}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Hủy sân không thành công!`);
                    return
                }
                setCheckDataStatus(!checkDataStatus);
                handleClose();
                toast.success('Hủy sân thành công!');
            })
        }
    }

    const changeTime = (option: boolean, checkTime: boolean, time?: string) => {
        const timeStart = time && time.match(/(\d+)h(\d+)/);
        const startHours = timeStart ? Number(timeStart[1]) : 0;
        const startMinutes = timeStart ? Number(timeStart[2]) : 0;

        const today = new Date();
        let hourToday = today.getHours();
        const minuteToday = today.getMinutes() > 30 ? 0 : 30;

        if (minuteToday == 0) {
            hourToday += 1;
        }

        const timeOpen = sport && sport.opening.match(/(\d+)h(\d+)/);
        const hourOpen = timeOpen ? Number(timeOpen[1]) : 0;
        const minuteOpen = timeOpen ? Number(timeOpen[2]) : 0;

        const timeClose = sport && sport.closing.match(/(\d+)h(\d+)/);
        const hourClose = timeClose ? Number(timeClose[1]) : 0;
        const minuteClose = timeClose ? Number(timeClose[2]) : 0;

        const checkDay = dateBooking && new Date().setHours(0, 0, 0, 0) === new Date(dateBooking).setHours(0, 0, 0, 0);

        const timeBookingStart = startTimeBooking && startTimeBooking.match(/(\d+)h(\d+)/);
        const timeBookingEnd = endTimeBooking && endTimeBooking.match(/(\d+)h(\d+)/);

        if (option && time) {
            if (checkTime) {
                if (hourClose == startHours && minuteClose == startMinutes) {
                    toast.success("Vượt quá thời gian đóng cửa!")
                } else if (timeBookingStart && timeBookingEnd &&
                    (Number(timeBookingStart[1]) * 60 + Number(timeBookingStart[2]))
                    == (Number(timeBookingEnd[1]) * 60 + Number(timeBookingEnd[2]) - 30)) {
                    toast.success("Thời gian đặt cách nhau tối thiểu 30 phút!")
                } else {
                    setStartTimeBooking(increaseTime(time))
                }
            } else {
                if (hourClose == startHours && minuteClose == startMinutes) {
                    toast.success("Vượt quá thời gian đóng cửa!")
                } else if (startTimeBooking && endTimeBooking &&
                    calculateTimeDifference(startTimeBooking, endTimeBooking) / 30 >= 6) {
                    toast.success("Chỉ được đặt tối đa 3 tiếng!")
                } else {
                    setEndTimeBooking(increaseTime(time))
                }
            }
        } else if (time) {
            if (checkTime) {
                if (checkDay && startHours === hourToday && minuteToday === startMinutes) {
                    toast.success("Vượt quá thời gian cần đặt hiện tại!")
                } else if (hourOpen == startHours && minuteOpen == startMinutes) {
                    toast.success("Vượt quá thời gian mở cửa!")
                } else if (startTimeBooking && endTimeBooking &&
                    calculateTimeDifference(startTimeBooking, endTimeBooking) / 30 >= 6) {
                    toast.success("Chỉ được đặt tối đa 3 tiếng!")
                } else {
                    setStartTimeBooking(reduceTime(time))
                }
            } else {
                if (timeBookingStart && timeBookingEnd &&
                    (Number(timeBookingStart[1]) * 60 + Number(timeBookingStart[2]) + 30)
                    == (Number(timeBookingEnd[1]) * 60 + Number(timeBookingEnd[2]))) {
                    toast.success("Thời gian đặt cách nhau tối thiểu 30 phút!")
                } else {
                    setEndTimeBooking(reduceTime(time))
                }
            }
        }

    };

    const reduceTime = (timeBooking: string): string => {
        const getTime = timeBooking.match(/(\d+)h(\d+)/);
        let hours = getTime ? Number(getTime[1]) : 0;
        let minutes = getTime ? Number(getTime[2]) : 0;

        // Decrement by 30 minutes
        if (minutes === 0) {
            minutes = 30;
            hours = hours > 0 ? hours - 1 : 23; // Wrap to previous hour or day
        } else {
            minutes = 0;
        }
        return `${hours}h${minutes === 0 ? '00' : '30'}`;
    };

    const increaseTime = (timeBooking: string): string => {
        const getTime = timeBooking.match(/(\d+)h(\d+)/);
        let hours = getTime ? Number(getTime[1]) : 0;
        let minutes = getTime ? Number(getTime[2]) : 0;

        // Increment by 30 minutes
        if (minutes === 0) {
            minutes = 30;
        } else {
            minutes = 0;
            hours = hours < 23 ? hours + 1 : 0; // Wrap to next hour or day
        }
        return `${hours}h${minutes === 0 ? '00' : '30'}`;
    };

    const [dataTimeOnStage, setDataTimeOnStage] = useState<string[]>([]);
    const [dataTimeOnStageAll, setDataTimeOnStageAll] = useState<string[]>([]);

    useEffect(() => {
        createTimeByTimeOnStageAll();
    }, [bookingBySubscriptionKey])

    const confirmDataBooking = async () => {

        const sportDetail = sport?.sportFielDetails.find(item => item.sportFielDetailId == idSportDetail);

        let isAvailable = true;

        let checkTime = false;


        if (applyOne) {
            if (sport && dateBooking && new Date(dateBooking).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
                for (const time of dataTimeOnStage) {
                    const result = isTimeWithinRange(sport.opening, new Date().getHours() + "h" + new Date().getMinutes(), time);
                    console.log(result);

                    if (result) {
                        checkTime = true;
                    }
                }
            }

            if (checkTime) {
                toast.success("trùng ngày")
                return
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/rest/user/booking/detail/getbyday/${sportDetail?.sportFielDetailId}/${dateBooking}`
                );

                if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
                const text = await response.text();

                if (text) {
                    const dataBooking = JSON.parse(text) as BookingDetail[];
                    if (dataBooking && Object.keys(dataBooking).length > 0) {
                        for (const item of dataBooking) {
                            for (const time of dataTimeOnStage) {
                                const result = isTimeWithinRange(item.startTime, item.endTime, time);
                                if (!result) {
                                    continue;
                                } else if (item.endTime == time) {
                                    continue;
                                } else {
                                    if (item.bookingDetailId == bookingDetailData?.bookingDetailId) {
                                        continue;
                                    } else {
                                        isAvailable = false;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("API or JSON parsing error:", error);
            }
        } else {
            if (bookingBySubscriptionKey && dateBooking) {
                const date = new Date(dateBooking).setHours(0, 0, 0, 0);

                let check = true;
                let timeIndex = 0;
                while (check && bookingDetailData) {
                    const dateTemporary = new Date(bookingDetailData.date);  // Sao chép đối tượng Date từ bookingDetailData
                    dateTemporary.setDate(dateTemporary.getDate() + timeIndex);  // Cộng thêm timeIndex ngày
                    dateTemporary.setHours(0, 0, 0, 0);  // Đảm bảo là giờ 00:00:00.000

                    if (date == dateTemporary.getTime()) {  // So sánh thời gian, vì setHours sẽ thay đổi đối tượng Date
                        check = false;
                    } else {
                        if (timeIndex >= 0) {
                            timeIndex = -timeIndex - 1;
                        } else {
                            timeIndex = -timeIndex; // Chuyển timeIndex về dương nếu kiểm tra xong ngày trước đó
                        }
                    }
                }
                console.log(`Khoảng cách giữa hai ngày là: ${timeIndex} ngày`);

                const bk = bookingBySubscriptionKey.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                console.log('bk', bk);


                if (sport && dateBooking && new Date().setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
                    for (const time of dataTimeOnStageAll) {
                        const result = isTimeWithinRange(sport.opening, new Date().getHours() + "h" + new Date().getMinutes(), time);
                        console.log(result);

                        if (result) {
                            checkTime = true;
                        }
                    }
                }

                if (checkTime) {
                    toast.success("trùng ngày 2")
                    return
                }

                for (const b of bookingBySubscriptionKey) {
                    const dateTemporary = new Date(b.date);
                    dateTemporary.setDate(dateTemporary.getDate() + timeIndex);

                    const year = dateTemporary.getFullYear();
                    const month = String(dateTemporary.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
                    const day = String(dateTemporary.getDate()).padStart(2, '0');  // Đảm bảo ngày luôn có 2 chữ số

                    console.log(`${year}-${month}-${day}`);

                    try {
                        const response = await fetch(
                            `http://localhost:8080/rest/user/booking/detail/getbyday/${sportDetail?.sportFielDetailId}/${year}-${month}-${day}`
                        );

                        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
                        const text = await response.text();

                        if (text) {
                            const dataBooking = JSON.parse(text) as BookingDetail[];
                            if (dataBooking && Object.keys(dataBooking).length > 0) {
                                for (const item of dataBooking) {
                                    for (const time of dataTimeOnStageAll) {
                                        const result = isTimeWithinRange(item.startTime, item.endTime, time);
                                        if (!result) {
                                            continue;
                                        } else if (item.endTime == time) {
                                            continue;
                                        } else {
                                            if (item.subcriptionKey == bookingDetailData?.subcriptionKey) {
                                                continue;
                                            } else {
                                                isAvailable = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error("API or JSON parsing error:", error);
                    }
                }
            }

            // toast.warning('Đang kiểm tra tất cả!');
        }

        setConfirmData(isAvailable);

        if (isAvailable) {
            toast.warning('Sân này còn trống, bạn có thể xác nhận!');
        } else {
            toast.warning('Đã có sân đặt rồi!');
        }
    }

    const createTimeByTimeOnStageAll = async () => {
        console.log('dataBookingBySubscriptionKey', bookingBySubscriptionKey);

        const timeSlots = [];

        if (bookingBySubscriptionKey) {
            for (const item of bookingBySubscriptionKey) {
                const getTime = startTimeBooking && startTimeBooking.match(/(\d+)h(\d+)/);
                const startHours = getTime ? Number(getTime[1]) : 0;
                const startMinutes = getTime ? Number(getTime[2]) : 0;

                let currentHours = startHours;
                let currentMinutes = startMinutes;

                if (item.startTime && item.endTime) {
                    for (let i = 0; i <= calculateTimeDifference(item.startTime, item.endTime) / 30; i++) {
                        timeSlots.push(`${currentHours}h${currentMinutes === 0 ? '00' : currentMinutes}`);
                        currentMinutes += 30;

                        if (currentMinutes >= 60) {
                            currentHours += Math.floor(currentMinutes / 60);
                            currentMinutes = currentMinutes % 60;
                        }
                    }
                }
                timeSlots.pop();
            }
        }
        console.log(timeSlots);

        setDataTimeOnStageAll(timeSlots);
    }


    useEffect(() => {
        createTimeByTimeOnStage();
    }, [startTimeBooking, endTimeBooking])

    const createTimeByTimeOnStage = () => {
        const getTime = startTimeBooking && startTimeBooking.match(/(\d+)h(\d+)/);
        const startHours = getTime ? Number(getTime[1]) : 0;
        const startMinutes = getTime ? Number(getTime[2]) : 0;

        const timeSlots = [];

        let currentHours = startHours;
        let currentMinutes = startMinutes;

        if (startTimeBooking && endTimeBooking) {
            for (let i = 0; i <= calculateTimeDifference(startTimeBooking, endTimeBooking) / 30; i++) {
                timeSlots.push(`${currentHours}h${currentMinutes === 0 ? '00' : currentMinutes}`);
                currentMinutes += 30;

                if (currentMinutes >= 60) {
                    currentHours += Math.floor(currentMinutes / 60);
                    currentMinutes = currentMinutes % 60;
                }
            }
        }

        timeSlots.pop();
        setDataTimeOnStage(timeSlots);
    }


    const isTimeWithinRange = (startTime: string, endTime: string, checkTime: string): boolean => {
        const [startHours, startMinutes] = startTime.split('h').map(Number);
        const [endHours, endMinutes] = endTime.split('h').map(Number);
        const [checkHours, checkMinutes] = checkTime.split('h').map(Number);

        // Tạo đối tượng Date cho từng thời gian
        const startDate = new Date(0, 0, 0, startHours, startMinutes);
        const endDate = new Date(0, 0, 0, endHours, endMinutes);
        const checkDate = new Date(0, 0, 0, checkHours, checkMinutes);

        // Kiểm tra thời gian nằm trong khoảng
        return checkDate >= startDate && checkDate <= endDate;
    }

    useEffect(() => {
        getPriceByTimeBooking();
    }, [startTimeBooking, endTimeBooking])


    const convertToMinutes = (time: string) => {
        const [hours, minutes] = time.split('h').map(Number);
        return (hours * 60) + minutes;
    };

    const calculateTimeDifference = (start: string, end: string) => {
        const startTotalMinutes = convertToMinutes(start);
        const endTotalMinutes = convertToMinutes(end);

        return endTotalMinutes - startTotalMinutes;
    };

    const isEven = (number: number): boolean => {
        return number % 2 === 0;
    }

    const [price, setPrice] = useState<number>();

    const getPriceByTimeBooking = () => {

        const sportDetail = sport?.sportFielDetails.find(item => item.sportFielDetailId == idSportDetail);

        if (startTimeBooking && endTimeBooking && sportDetail) {
            const timeBooking = calculateTimeDifference(startTimeBooking, endTimeBooking) / 30;

            if (isEven(timeBooking)) {
                setPrice(sportDetail.price * timeBooking / 2);
                // toast.success(sportDetail.price * timeBooking / 2);
            } else {
                if (timeBooking == 1) {
                    setPrice((sportDetail.price * timeBooking) / 2);
                    // toast.success((sportDetail.price * timeBooking) / 2)
                } else {
                    setPrice((sportDetail.price * timeBooking / 2));
                    // toast.success((sportDetail.price * timeBooking / 2))
                }
            }
        }
    }

    useEffect(() => {
        setConfirmData(false);
    }, [startTimeBooking, endTimeBooking, idSportDetail, dateBooking, applyOne])

    const handleUpdateBooking = async () => {
        if (applyOne) {
            fetch(`http://localhost:8080/rest/booking/update/booking/detail/${bookingDetailData?.bookingDetailId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingDetailId: bookingDetailData?.bookingDetailId,
                    idSportDetail,
                    dateBooking,
                    startTimeBooking,
                    endTimeBooking,
                    price
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                    return
                }
                // mutate(usernameFetchApi);
                setCheckDataStatus(!checkDataStatus);
                handleClose();
                toast.success('Cập nhật thành công!');
            })
        } else {
            if (bookingBySubscriptionKey && dateBooking) {
                const date = new Date(dateBooking).setHours(0, 0, 0, 0);

                let check = true;
                let timeIndex = 0;
                while (check && bookingDetailData) {
                    const dateTemporary = new Date(bookingDetailData.date);  // Sao chép đối tượng Date từ bookingDetailData
                    dateTemporary.setDate(dateTemporary.getDate() + timeIndex);  // Cộng thêm timeIndex ngày
                    dateTemporary.setHours(0, 0, 0, 0);  // Đảm bảo là giờ 00:00:00.000

                    if (date == dateTemporary.getTime()) {  // So sánh thời gian, vì setHours sẽ thay đổi đối tượng Date
                        check = false;
                    } else {
                        if (timeIndex >= 0) {
                            timeIndex = -timeIndex - 1; // Chuyển timeIndex sang giá trị âm để kiểm tra ngày trước đó
                        } else {
                            timeIndex = -timeIndex; // Chuyển timeIndex về dương nếu kiểm tra xong ngày trước đó
                        }
                    }

                }
                console.log(`Khoảng cách giữa hai ngày là: ${timeIndex} ngày`);

                for (const b of bookingBySubscriptionKey) {
                    const dateTemporary = new Date(b.date);
                    dateTemporary.setDate(dateTemporary.getDate() + timeIndex);

                    const year = dateTemporary.getFullYear();
                    const month = String(dateTemporary.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
                    const day = String(dateTemporary.getDate()).padStart(2, '0');  // Đảm bảo ngày luôn có 2 chữ số

                    console.log(`${year}-${month}-${day}`);

                    fetch(`http://localhost:8080/rest/booking/update/booking/detail/${b.bookingDetailId}`, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            bookingDetailId: b.bookingDetailId,
                            idSportDetail,
                            dateBooking: year + '-' + month + '-' + day,
                            startTimeBooking,
                            endTimeBooking,
                            price
                        }),
                    }).then(async (res) => {
                        if (!res.ok) {
                            toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                            return
                        }
                        // mutate(usernameFetchApi);
                        setCheckDataStatus(!checkDataStatus);
                        handleClose();
                    })
                }
                toast.success('Cập nhật thành công!');
            }
        }
    }

    const handleClose = () => {
        setApplyOne(true);
        setConfirmData(false);
        setEditBooking(true);
        setShowViewOrEditBookingModal(false);
    }


    return (
        <>
            <Modal show={showViewOrEditBookingModal} onHide={() => handleClose()} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">XEM VÀ CHỈNH SỬA THÔNG TIN ĐẶT SÂN </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin đặt - {bookingDetailData?.sportFieldDetail.name}
                                {bookingDetailData &&
                                    new Date().setHours(0, 0, 0, 0) <= new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                        new Date().getHours() < parseInt(bookingDetailData.endTime.split('h')[0]) ? (
                                            <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                                <i
                                                    className="bi bi-pencil-square ms-2 text-dark"
                                                    onClick={() => setEditBooking(!editBooking)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </OverlayTrigger>
                                        ) : (
                                            new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                                <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                                    <i
                                                        className="bi bi-pencil-square ms-2 text-dark"
                                                        onClick={() => setEditBooking(!editBooking)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </OverlayTrigger>
                                            )
                                        )
                                    )}
                            </h6>
                            <FloatingLabel controlId="floatingSelectTime" label="Chọn thời gian" className="mb-2">
                                <Form.Select
                                    value={idSportDetail || ""}
                                    disabled={editBooking}
                                    onChange={(e) => setIdSportDetail(Number(e.target.value))}
                                    aria-label="Default select example"
                                >
                                    {sport && sport.sportFielDetails.map((item, index) => (
                                        <option key={index} value={item.sportFielDetailId}>{item.name}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDate" label="Ngày đặt!" className="flex-grow-1 mb-2">
                                <Form.Control
                                    type="date"
                                    placeholder="Ngày đặt!"
                                    value={dateBooking || ""}
                                    onChange={(e) => setDateBooking(e.target.value)}
                                    min={today}
                                    disabled={editBooking}
                                />
                            </FloatingLabel>
                            <InputGroup>
                                <FloatingLabel controlId="floatingDate" label="Giờ bắt đầu!" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Giờ bắt đầu!"
                                        value={startTimeBooking || ""}
                                        disabled={editBooking}
                                    />
                                </FloatingLabel>
                                {!editBooking && (
                                    <>
                                        <Button disabled={editBooking} onClick={() => changeTime(false, true, startTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-up"></i>
                                        </Button>
                                        <Button disabled={editBooking} onClick={() => changeTime(true, true, startTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-down"></i>
                                        </Button>
                                    </>
                                )}
                                <FloatingLabel controlId="floatingDate" label="Giờ kết thúc!" className="ms-2 flex-grow-1 mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Giờ kết thúc!"
                                        value={endTimeBooking || ""}
                                        disabled={editBooking}
                                    />
                                </FloatingLabel>
                                {!editBooking && (
                                    <>
                                        <Button disabled={editBooking} onClick={() => changeTime(false, false, endTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-up"></i>
                                        </Button>
                                        <Button disabled={editBooking} onClick={() => changeTime(true, false, endTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
                                            <i className="bi bi-chevron-down"></i>
                                        </Button>
                                    </>
                                )}
                            </InputGroup>
                            <FloatingLabel controlId="floatingDate" label="Tổng tiền!" className="flex-grow-1 mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Giờ kết thúc!"
                                    value={formatPrice(price) || ""}
                                    disabled={editBooking}
                                />
                            </FloatingLabel>
                            {userData?.fullname == "Offline" && (
                                <FloatingLabel controlId="floatingUsername" label="Phương thức thanh toán *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        value={paymentMethod?.name || ""}
                                        type="text"
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel>
                            )}
                        </Col>
                        {userData?.fullname != "Offline" && (
                            <Col>
                                <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</h6>
                                <FloatingLabel controlId="floatingUsername" label="Họ và tên *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        value={userData?.fullname || ""}
                                        type="text"
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingUsername" label="Số điện thoại *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        type="text"
                                        value={userData?.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber || ""}
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel> <FloatingLabel controlId="floatingUsername" label="Phương thức thanh toán *" className="flex-grow-1 mb-2">
                                    <Form.Control
                                        value={paymentMethod?.name || ""}
                                        type="text"
                                        placeholder="Vui lòng nhập tên đăng nhập!"
                                        disabled
                                    />
                                </FloatingLabel>
                            </Col>
                        )}

                    </Row>
                    <Row className="mx-1 mb-2">
                        {bookingDetailData?.subcriptionKey && (
                            <>
                                <Col onClick={() => setApplyOne(true)} className={`col-day border p-2 text-white ${applyOne ? 'active' : ''}`}>Một ngày</Col>
                                <Col onClick={() => setApplyOne(false)} className={`col-day border p-2 text-white ${!applyOne ? 'active' : ''}`}>Tất cả ngày trong chung lịch</Col>
                            </>
                        )}
                    </Row>
                    <Row>
                        {bookingDetailData &&
                            new Date().setHours(0, 0, 0, 0) <= new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                new Date().getHours() < parseInt(bookingDetailData.endTime.split('h')[0]) ? (
                                    !editBooking ? (
                                        confirmData ? (
                                            <button onClick={() => handleUpdateBooking()} className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                        ) : (
                                            <button onClick={() => confirmDataBooking()} className="btn btn-dark m-auto" style={{ width: '97%' }}>Kiểm tra</button>
                                        )
                                    ) :
                                        <button className="btn btn-danger m-auto" onClick={() => handleCancelBookingDetail()} style={{ width: '97%' }}>Hủy đặt sân</button>

                                ) : (
                                    new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                        !editBooking ? (
                                            confirmData ? (
                                                <button onClick={() => handleUpdateBooking()} className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                            ) : (
                                                <button onClick={() => confirmDataBooking()} className="btn btn-dark m-auto" style={{ width: '97%' }}>Kiểm tra</button>
                                            )
                                        ) :
                                            <button className="btn btn-danger m-auto" onClick={() => handleCancelBookingDetail()} style={{ width: '97%' }}>Hủy đặt sân</button>
                                    )
                                )
                            )}
                    </Row>
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

export default BookingModal;