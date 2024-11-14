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
    startTimeKey: number;
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
    const [dateBookingTemporary, setDateBookingTemporary] = useState<string>();
    const [idSportDetail, setIdSportDetail] = useState<number>();
    const [idSportDetailTemporary, setIdSportDetailTemporary] = useState<number>();
    const [startTimeBooking, setStartTimeBooking] = useState<string>();
    const [endTimeBooking, setEndTimeBooking] = useState<string>();
    const [confirmData, setConfirmData] = useState<boolean>(false);
    const [applyOne, setApplyOne] = useState<boolean>(true);
    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    const [isAddBooking, setIsAddBooking] = useState<boolean>(false);
    const [newEndTimeBooking, setNewEndTimeBooking] = useState<string>();
    const [newIdSportBooking, setNewIdSportBooking] = useState<number>();
    const [newPriceBooking, setNewPriceBooking] = useState<number>();
    const [confirmNewData, setConfirmNewData] = useState<boolean>(false);


    useEffect(() => {
        setDateBooking(bookingDetailData?.date);
        setDateBookingTemporary(bookingDetailData?.date);
        setStartTimeBooking(bookingDetailData?.startTime);
        setEndTimeBooking(bookingDetailData?.endTime);
        setIdSportDetail(bookingDetailData?.sportFieldDetail.sportFielDetailId);
        setIdSportDetailTemporary(bookingDetailData?.sportFieldDetail.sportFielDetailId);
    }, [bookingDetailData])

    const handleCancelBookingDetail = () => {
        if (confirm("Bạn có chắc chắn muốn hủy sân?")) {
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
                fetch(`http://localhost:8080/rest/booking/update/status/by/subcriptionKey/${bookingDetailData?.bookingDetailId}/${bookingDetailData?.subscriptionKey}`, {
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

    }

    const changeTime = (option: boolean, checkTime: boolean, time?: string, checkNewTime?: boolean) => {
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
        if (checkNewTime && checkNewTime && time) {
            const newTimeBookingStart = endTimeBooking && endTimeBooking.match(/(\d+)h(\d+)/);
            const newTimeBookingEnd = newEndTimeBooking && newEndTimeBooking.match(/(\d+)h(\d+)/);

            if (checkTime) {
                if (newTimeBookingStart && newTimeBookingEnd &&
                    (Number(newTimeBookingStart[1]) * 60 + Number(newTimeBookingStart[2]) + 30)
                    == (Number(newTimeBookingEnd[1]) * 60 + Number(newTimeBookingEnd[2]))) {
                    toast.success("Thời gian đặt cách nhau tối thiểu 30 phút!")
                } else {
                    setNewEndTimeBooking(reduceTime(time))
                }
            } else {
                if (newTimeBookingEnd &&
                    sport?.closing === newTimeBookingEnd[1].toString() + "h" && minuteClose === Number(newTimeBookingEnd[2])) {
                    toast.success("Vượt quá thời gian đóng cửa!")
                } else if (endTimeBooking && newEndTimeBooking &&
                    calculateTimeDifference(endTimeBooking, newEndTimeBooking) / 30 >= 6) {
                    toast.success("Chỉ được đặt tối đa 3 tiếng!")
                } else {
                    setNewEndTimeBooking(increaseTime(time))
                }
            }
        } else if (option && time) {
            if (checkTime) {
                if (timeBookingStart && timeBookingEnd &&
                    (Number(timeBookingStart[1]) * 60 + Number(timeBookingStart[2]))
                    == (Number(timeBookingEnd[1]) * 60 + Number(timeBookingEnd[2]) - 30)) {
                    toast.success("Thời gian đặt cách nhau tối thiểu 30 phút!")
                } else {
                    setStartTimeBooking(increaseTime(time))
                }
            } else {
                if (timeBookingEnd &&
                    sport?.closing === timeBookingEnd[1].toString() + "h" && minuteClose === Number(timeBookingEnd[2])) {
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
                if (checkDay && startHours <= hourToday && minuteToday <= startMinutes) {
                    toast.success("Vượt quá thời gian cần đặt hiện tại!")
                } else if (startTimeBooking && endTimeBooking &&
                    calculateTimeDifference(startTimeBooking, endTimeBooking) / 30 >= 6) {
                    toast.success("Chỉ được đặt tối đa 3 tiếng!")
                } else if (sport?.opening === startHours.toString() + "h" && minuteOpen === startMinutes) {
                    toast.success("Vượt quá thời gian mở cửa!")
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
            // if (dateBookingTemporary != dateBooking && idSportDetailTemporary != idSportDetail) {
            if (sport && dateBooking && new Date(dateBooking).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
                for (const time of dataTimeOnStage) {
                    const result = isTimeWithinRange(sport.opening, new Date().getHours() + "h" + new Date().getMinutes(), time);
                    // console.log(result);

                    if (result) {
                        checkTime = true;
                    }
                }
            }

            if (checkTime) {
                toast.warning("Thời gian ngày " + dateBooking + " đã có người đặt hoặc quá giờ rồi!")
                return
            }
            // } else {
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
            // }

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
                // console.log(`Khoảng cách giữa hai ngày là: ${timeIndex} ngày`);

                console.log('bookingBySubscriptionKey', bookingBySubscriptionKey);

                // // Biến lưu trữ booking có ngày sớm nhất
                // let earliestBooking = bookingBySubscriptionKey[0];

                // // Duyệt qua mảng bookingBySubscriptionKey để tìm ngày sớm nhất
                // for (let i = 1; i < bookingBySubscriptionKey.length; i++) {
                //     const currentBookingDate = new Date(bookingBySubscriptionKey[i].date);
                //     const earliestBookingDate = new Date(earliestBooking.date);

                //     if (currentBookingDate < earliestBookingDate) {
                //         earliestBooking = bookingBySubscriptionKey[i];
                //     }
                // }

                // console.log('earliestBooking', earliestBooking);

                if (sport && dateBooking && new Date().setHours(0, 0, 0, 0) === new Date(dateBooking).setHours(0, 0, 0, 0)) {
                    for (const time of dataTimeOnStageAll) {
                        const result = isTimeWithinRange(sport.opening, new Date().getHours() + "h" + new Date().getMinutes(), time);
                        // console.log(result);

                        if (result) {
                            checkTime = true;
                        }
                    }
                }

                if (checkTime) {
                    toast.warning("Thời gian ngày " + dateBooking + " đã có người đặt hoặc quá giờ rồi!")
                    return
                }

                const bk = bookingBySubscriptionKey.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                console.log('bk', bk[0].date);

                const dateTemporaryChecked = new Date(bk[0].date);
                dateTemporaryChecked.setDate(dateTemporaryChecked.getDate() + timeIndex);

                const year = dateTemporaryChecked.getFullYear();
                const month = String(dateTemporaryChecked.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
                const day = String(dateTemporaryChecked.getDate()).padStart(2, '0');  // Đảm bảo ngày luôn có 2 chữ số
                // toast.success(new Date().getFullYear().toString()
                //     + '-' + String(new Date().getMonth() + 1).padStart(2, '0')
                //     + '-' + new Date().getDate().toString() + 'and' + year + '-' + month + '-' + day)

                if (timeIndex !== 0 &&
                    new Date(year + '-' + month + '-' + day).setHours(0, 0, 0, 0) < new Date(new Date().getFullYear().toString()
                        + '-' + String(new Date().getMonth() + 1).padStart(2, '0')
                        + '-' + new Date().getDate().toString()).setHours(0, 0, 0, 0)) {
                    toast.warning("Ngày " + bk[0].date + " trong kỳ bị quá ngày hiện tại!")
                    return;
                }

                for (const b of bookingBySubscriptionKey) {
                    const dateTemporary = new Date(b.date);
                    dateTemporary.setDate(dateTemporary.getDate() + timeIndex);

                    const year = dateTemporary.getFullYear();
                    const month = String(dateTemporary.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
                    const day = String(dateTemporary.getDate()).padStart(2, '0');  // Đảm bảo ngày luôn có 2 chữ số

                    // console.log(`${year}-${month}-${day}`);

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
                                            if (item.subscriptionKey == bookingDetailData?.subscriptionKey) {
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
        // console.log('dataBookingBySubscriptionKey', bookingBySubscriptionKey);

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
        setConfirmNewData(false);
    }, [startTimeBooking, endTimeBooking, idSportDetail, dateBooking, applyOne, newEndTimeBooking, newIdSportBooking])

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
                // console.log(`Khoảng cách giữa hai ngày là: ${timeIndex} ngày`);

                for (const b of bookingBySubscriptionKey) {
                    const dateTemporary = new Date(b.date);
                    dateTemporary.setDate(dateTemporary.getDate() + timeIndex);

                    const year = dateTemporary.getFullYear();
                    const month = String(dateTemporary.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
                    const day = String(dateTemporary.getDate()).padStart(2, '0');  // Đảm bảo ngày luôn có 2 chữ số

                    // console.log(`${year}-${month}-${day}`);

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
        setEditBooking(true);
        setConfirmData(false);
        setApplyOne(true);
        setIsAddBooking(false);
        setConfirmNewData(false);

        setShowViewOrEditBookingModal(false);
    }


    const handleAddBooking = () => {
        const endTime = bookingDetailData?.endTime;

        const time = endTime && endTime.split("h");
        const hour = time && Number(time[0]);
        const minute = time && Number(time[1]);

        if (minute === 0) {
            setNewEndTimeBooking(`${hour && hour}h30`);
        } else if (minute === 30) {
            setNewEndTimeBooking(`${hour && hour + 1}h00`);
        }

        setNewIdSportBooking(sport?.sportFielDetails[0].sportFielDetailId)
        setIsAddBooking(!isAddBooking);
        setEditBooking(true);
    }

    useEffect(() => {
        getAddNewPriceByTimeBooking()
    }, [newEndTimeBooking, newIdSportBooking])

    const getAddNewPriceByTimeBooking = () => {

        const sportDetail = sport?.sportFielDetails.find(item => item.sportFielDetailId == newIdSportBooking);

        if (bookingDetailData && newEndTimeBooking && bookingDetailData.endTime && sportDetail) {
            // toast.success("gias")

            const timeBooking = calculateTimeDifference(bookingDetailData.endTime, newEndTimeBooking) / 30;

            if (isEven(timeBooking)) {
                setNewPriceBooking(sportDetail.price * timeBooking / 2);
                // toast.success(sportDetail.price * timeBooking / 2);
            } else {
                if (timeBooking == 1) {
                    setNewPriceBooking((sportDetail.price * timeBooking) / 2);
                    // toast.success((sportDetail.price * timeBooking) / 2)
                } else {
                    setNewPriceBooking((sportDetail.price * timeBooking / 2));
                    // toast.success((sportDetail.price * timeBooking / 2))
                }
            }
        }
    }

    const confirmNewDataBooking = async () => {
        const sportDetail = sport?.sportFielDetails.find(item => item.sportFielDetailId == newIdSportBooking);

        let isAvailable = true;

        let checkTime = false;

        const getTime = bookingDetailData?.endTime && bookingDetailData?.endTime.match(/(\d+)h(\d+)/);
        const startHours = getTime ? Number(getTime[1]) : 0;
        const startMinutes = getTime ? Number(getTime[2]) : 0;

        const timeSlots = [];

        let currentHours = startHours;
        let currentMinutes = startMinutes;

        if (newEndTimeBooking && bookingDetailData?.endTime) {
            for (let i = 0; i <= calculateTimeDifference(bookingDetailData?.endTime, newEndTimeBooking) / 30; i++) {
                timeSlots.push(`${currentHours}h${currentMinutes === 0 ? '00' : currentMinutes}`);
                currentMinutes += 30;

                if (currentMinutes >= 60) {
                    currentHours += Math.floor(currentMinutes / 60);
                    currentMinutes = currentMinutes % 60;
                }
            }
        }
        timeSlots.pop();

        if (dateBookingTemporary != dateBooking && idSportDetailTemporary != idSportDetail) {
            if (sport && dateBooking && new Date(dateBooking).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
                for (const time of timeSlots) {
                    const result = isTimeWithinRange(sport.opening, new Date().getHours() + "h" + new Date().getMinutes(), time);
                    // console.log(result);

                    if (result) {
                        checkTime = true;
                    }
                }
            }

            if (checkTime) {
                toast.warning("Thời gian ngày " + dateBooking + " đã có người đặt hoặc quá giờ rồi!")
                return
            }
        } else {
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
                            for (const time of timeSlots) {
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
        }


        setConfirmNewData(isAvailable);

        if (isAvailable) {
            toast.warning('Sân này còn trống, bạn có thể xác nhận!');
        } else {
            toast.warning('Đã có sân đặt rồi!');
        }
    }

    const handleUpdateNewBooking = () => {
        fetch(`http://localhost:8080/rest/booking/detail/add/new`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingDetailId: bookingDetailData?.bookingDetailId,
                newIdSportBooking,
                dateBooking,
                startTimeBooking: bookingDetailData?.endTime,
                endTimeBooking: newEndTimeBooking,
                price: newPriceBooking
            }),
        }).then(async (res) => {
            if (!res.ok) {
                toast.error(`Cập nhật không thành công! Vui lòng thử lại sau!`);
                return
            }
            // mutate(usernameFetchApi);
            setEditBooking(true);
            setIsAddBooking(false);
            setCheckDataStatus(!checkDataStatus);
            handleClose();
            toast.success('Cập nhật thành công!');
        })
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
                            <div className="d-flex  justify-content-between">
                                {bookingDetailData && (
                                    <>
                                        {/* Kiểm tra ngày hiện tại và ngày đặt */}
                                        {new Date().setHours(0, 0, 0, 0) === new Date(bookingDetailData.date).setHours(0, 0, 0, 0) ?
                                            (new Date().getHours() * 60) + new Date().getMinutes() < (parseInt(bookingDetailData.endTime.split('h')[0]) * 60) + parseInt(bookingDetailData.endTime.split('h')[1]) && (
                                                <OverlayTrigger overlay={<Tooltip>Sửa {new Date().setHours(0, 0, 0, 0)} - {new Date(bookingDetailData.date).setHours(0, 0, 0, 0)}</Tooltip>}>
                                                    <i
                                                        className="bi bi-pencil-square ms-2 text-dark"
                                                        onClick={() => {
                                                            setEditBooking(!editBooking),
                                                                setIsAddBooking(false)
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </OverlayTrigger>
                                            )
                                            :
                                            new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) &&
                                            <OverlayTrigger overlay={<Tooltip>Sửa</Tooltip>}>
                                                <i
                                                    className="bi bi-pencil-square ms-2 text-dark"
                                                    onClick={() => {
                                                        setEditBooking(!editBooking),
                                                            setIsAddBooking(false)
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </OverlayTrigger>
                                        }

                                        <h6 className="text-uppercase text-danger m-auto fw-bold text-center">
                                            Thông tin đặt - {bookingDetailData?.sportFieldDetail.name}
                                        </h6>

                                        {/* Hiển thị điều kiện tương tự lần thứ hai */}
                                        {new Date().setHours(0, 0, 0, 0) === new Date(bookingDetailData.date).setHours(0, 0, 0, 0) ?
                                            (new Date().getHours() * 60) + new Date().getMinutes()
                                            < (parseInt(bookingDetailData.endTime.split('h')[0]) * 60) +
                                            parseInt(bookingDetailData.endTime.split('h')[1]) && (
                                                <OverlayTrigger overlay={<Tooltip>Thêm mới 1 </Tooltip>}>
                                                    <button disabled={sport && parseInt(sport.closing.split('h')[0])
                                                        === parseInt(bookingDetailData.endTime.split('h')[0])}
                                                        style={{ border: 'none', backgroundColor: 'white' }}>
                                                        <i onClick={() => handleAddBooking()} className="bi bi-plus-lg" style={{ cursor: 'pointer' }} />
                                                    </button>
                                                </OverlayTrigger>
                                            )
                                            :
                                            new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) &&
                                            <OverlayTrigger overlay={<Tooltip>Thêm mới</Tooltip>}>
                                                <button style={{ border: 'none', backgroundColor: 'white' }}>
                                                    <i onClick={() => handleAddBooking()} className="bi bi-plus-lg" style={{ cursor: 'pointer' }} />
                                                </button>
                                            </OverlayTrigger>
                                        }
                                    </>
                                )}

                            </div>
                            {isAddBooking ?
                                <>
                                    <FloatingLabel controlId="floatingSelectTime" label="Chọn sân" className="mb-2">
                                        <Form.Select
                                            value={newIdSportBooking || ""}
                                            disabled={!isAddBooking}
                                            onChange={(e) => setNewIdSportBooking(Number(e.target.value))}
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
                                            disabled={true}
                                        />
                                    </FloatingLabel>
                                    <InputGroup>
                                        <FloatingLabel controlId="floatingDate" label="Giờ bắt đầu!" className="flex-grow-1 mb-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Giờ bắt đầu!"
                                                value={bookingDetailData?.endTime || ""}
                                                disabled={isAddBooking}
                                            />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="floatingDate" label="Giờ kết thúc!" className="ms-2 flex-grow-1 mb-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Giờ kết thúc!"
                                                value={newEndTimeBooking || ""}
                                                disabled={!isAddBooking}
                                            />
                                        </FloatingLabel>
                                        {isAddBooking && (
                                            <>
                                                <Button disabled={!isAddBooking} onClick={() => changeTime(false, true, newEndTimeBooking, true)} variant="outline-secondary mb-2" id="button-addon1">
                                                    <i className="bi bi-chevron-up"></i>
                                                </Button>
                                                <Button disabled={!isAddBooking} onClick={() => changeTime(true, false, newEndTimeBooking, true)} variant="outline-secondary mb-2" id="button-addon1">
                                                    <i className="bi bi-chevron-down"></i>
                                                </Button>
                                            </>
                                        )}
                                    </InputGroup>
                                    <FloatingLabel controlId="floatingDate" label="Tổng tiền!" className="flex-grow-1 mb-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Giờ kết thúc!"
                                            value={formatPrice(newPriceBooking) || ""}
                                            disabled={isAddBooking}
                                        />
                                    </FloatingLabel>
                                </>
                                :
                                <>
                                    <FloatingLabel controlId="floatingSelectTime" label="Chọn sân" className="mb-2">
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
                                                <Button
                                                    disabled={
                                                        editBooking ||
                                                        (() => {
                                                            if (!startTimeBooking) return true;
                                                            const [hours, minutes] = startTimeBooking.split('h').map(Number);
                                                            const bookingTime = new Date();
                                                            bookingTime.setHours(hours, minutes, 0, 0); // Đặt giờ và phút từ startTimeBooking
                                                            return bookingTime.getTime() <= Date.now(); // So sánh với thời gian hiện tại
                                                        })()
                                                    }
                                                    onClick={() => changeTime(false, true, startTimeBooking)}
                                                    variant="outline-secondary mb-2"
                                                    id="button-addon1"
                                                >    <i className="bi bi-chevron-up"></i>
                                                </Button>

                                                <Button
                                                    disabled={
                                                        editBooking ||
                                                        (() => {
                                                            if (!startTimeBooking) return true;
                                                            const [hours, minutes] = startTimeBooking.split('h').map(Number);
                                                            const bookingTime = new Date();
                                                            bookingTime.setHours(hours, minutes, 0, 0); // Đặt giờ và phút từ startTimeBooking
                                                            return bookingTime.getTime() <= Date.now(); // So sánh với thời gian hiện tại
                                                        })()
                                                    }
                                                    onClick={() => changeTime(true, true, startTimeBooking)} variant="outline-secondary mb-2" id="button-addon1">
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
                                </>
                            }

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
                        {bookingDetailData?.subscriptionKey && bookingDetailData.subscriptionKey.includes('keybooking') && (
                            <>
                                <Col onClick={() => setApplyOne(true)} className={`col-day border p-2 text-white ${applyOne ? 'active' : ''}`}>Một ngày</Col>
                                <Col onClick={() => setApplyOne(false)} className={`col-day border p-2 text-white ${!applyOne ? 'active' : ''}`}>Tất cả ngày trong chung lịch</Col>
                            </>
                        )}
                    </Row>
                    <Row>
                        {!isAddBooking ?
                            bookingDetailData &&
                                new Date().setHours(0, 0, 0, 0) === new Date(bookingDetailData.date).setHours(0, 0, 0, 0) ? (
                                new Date().getHours() <= parseInt(bookingDetailData.endTime.split('h')[0]) && (
                                    !editBooking ? (
                                        confirmData ? (
                                            <button onClick={() => handleUpdateBooking()} className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                        ) : (
                                            <button onClick={() => confirmDataBooking()} className="btn btn-dark m-auto" style={{ width: '97%' }}>Kiểm tra chỉnh sửa sân</button>
                                        )
                                    ) : (
                                        <button className="btn btn-danger m-auto" onClick={() => handleCancelBookingDetail()} style={{ width: '97%' }}>Hủy đặt sân</button>

                                    )
                                )
                            ) : (
                                bookingDetailData && new Date().setHours(0, 0, 0, 0) < new Date(bookingDetailData.date).setHours(0, 0, 0, 0) && (
                                    !editBooking ? (
                                        confirmData ? (
                                            <button onClick={() => handleUpdateBooking()} className="btn btn-danger m-auto" style={{ width: '97%' }}>Cập nhật</button>
                                        ) : (
                                            <button onClick={() => confirmDataBooking()} className="btn btn-dark m-auto" style={{ width: '97%' }}>Kiểm tra chỉnh sửa sân</button>
                                        )
                                    ) : (
                                        <button className="btn btn-danger m-auto" onClick={() => handleCancelBookingDetail()} style={{ width: '97%' }}>Hủy đặt sân</button>
                                    )
                                )
                            ) : (
                                confirmNewData ?
                                    <button onClick={() => handleUpdateNewBooking()} className="btn btn-danger m-auto" style={{ width: '97%' }}>Thêm sân mới</button>
                                    :
                                    <button onClick={() => confirmNewDataBooking()} className="btn btn-dark m-auto" style={{ width: '97%' }}>Kiểm tra thêm mới sân</button>
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