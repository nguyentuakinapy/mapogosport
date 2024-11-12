import { formatDateNotime, formatPrice } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup, Nav } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import useSWR from "swr";
import 'react-datepicker/dist/react-datepicker.css';
import { useData } from "@/app/context/UserContext";

interface BookingProps {
    showBookingModal: boolean;
    setShowBookingModal: (v: boolean) => void;
    sportDetail?: SportFieldDetail;
    startTime: string;
    dayStartBooking: string;
    sport?: SportField | null;
    owner?: Owner;
    checkDataStatus: boolean;
    setCheckDataStatus: (v: boolean) => void;
    startTimeKey: boolean;
}

type DateDetail = {
    date: string;
}

type DateType = {
    [week: string]: {
        [index: number]: DateDetail[];
    };
};

type WeekBookingDetail = {
    [week: string]: BookingDetail[];
}

const BookingModal = (props: BookingProps) => {
    const { showBookingModal, setShowBookingModal, sportDetail, startTime,
        dayStartBooking, sport, owner, checkDataStatus, setCheckDataStatus, startTimeKey } = props;
    const [selectTime, setSelectTime] = useState<string>('Chọn thời gian');
    const [selectTimeOnStage, setSelectTimeOnStage] = useState<string>('Chọn thời gian');
    const [activeTab, setActiveTab] = useState<string>('byDay');
    const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethod[]>();
    const [checkPrepayPrice, setCheckPrepayPrice] = useState<boolean>(true);
    const userData = useData();
    const [totalAmount, setTotalAmount] = useState<number>();
    const [prepayPrice, setPrepayPrice] = useState<number>();
    const [paymentMethodId, setPaymentMethodId] = useState<number>(0);
    const [endTime, setEndTime] = useState<string>();
    const [price, setPrice] = useState<number>();
    const [operatingTime, setOperatingTime] = useState<number>(0);
    const [operatingTimeFetchData, setOperatingTimeFetchData] = useState<number>(0);
    const [dataTime, setDataTime] = useState<String[]>();

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data } = useSWR(`http://localhost:8080/rest/paymentMethod`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setDataPaymentMethod(data);
    }, [data]);

    useEffect(() => {
        if (!startTime || !dayStartBooking) return;
        const calculateBookingTimes = () => {
            const times = [startTime];
            for (let i = 0; i < operatingTime * 2; i++) {
                const [hour] = times[i].match(/\d+/) || [];
                times.push(times[i].includes("h30") ? `${Number(hour) + 1}h00` : `${hour}h30`);
            }
            return times;
        };

        const checkBookingAvailability = async (times: any) => {
            for (let i = 0; i < Math.min(times.length, 6); i++) {
                const response = await fetch(`http://localhost:8080/rest/booking/detail/findbystarttime/sportfielddetail/${times[i]}/${sportDetail?.sportFielDetailId}/${dayStartBooking}`);
                if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
                const data = await response.text();
                if (data) {
                    setOperatingTimeFetchData(i);
                    break;
                }
            }
        };

        checkBookingAvailability(calculateBookingTimes());
    }, [operatingTime, startTime, dayStartBooking]);

    useEffect(() => {
        getTime();
    }, [startTimeKey]);

    const getTime = () => {
        if (startTime && sport?.closing) {
            const [openHour, openMinute] = startTime.split("h").map(Number);
            const [closeHour, closeMinute] = sport.closing.split("h").map(Number);
            const totalOpenMinutes = openHour * 60 + openMinute;
            const totalCloseMinutes = closeHour * 60 + closeMinute;
            setOperatingTime((totalCloseMinutes - totalOpenMinutes) / 60);
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
                if (hours === 0 && minutes === 0) continue;

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
    }

    useEffect(() => {
        getPriceByTimeBooking(selectTime);
    }, [selectTime]);

    useEffect(() => {
        getPriceByTimeBooking(selectTimeOnStage);
    }, [selectTimeOnStage]);

    const getPriceByTimeBooking = (slTime: string) => {
        if (slTime == 'Chọn thời gian') {
            setPrice(0);
            setEndTime("");
            return;
        }
        if (slTime && sportDetail) {
            const getTime = startTime.match(/(\d+)h(\d+)/);
            const hours = getTime ? Number(getTime[1]) : 0;
            const minutes = getTime ? Number(getTime[2]) : 0;

            let endHour = hours;
            let endMinute = minutes;

            const selectedTime = dataTime && dataTime.find(item => item === slTime);
            if (selectedTime) {
                const timeParts = selectedTime.split(' ');

                let hoursToAdd = 0;
                let minutesToAdd = 0;

                for (let i = 0; i < timeParts.length; i++) {
                    if (timeParts[i].includes('giờ')) {
                        hoursToAdd += Number(timeParts[i - 1]);
                    }

                    if (timeParts[i].includes('phút')) {
                        minutesToAdd += Number(timeParts[i - 1]);
                    }
                }

                endHour += hoursToAdd;
                endMinute += minutesToAdd;

                if (endMinute >= 60) {
                    endHour += Math.floor(endMinute / 60);
                    endMinute = endMinute % 60;
                }

                setEndTime(`${endHour}h${endMinute > 0 ? endMinute : '00'}`);
                const hetcuu = (`${endHour}h${endMinute > 0 ? endMinute : '00'}`);
                const selectedPrice = calculateBookingPrice(sportDetail, startTime, hetcuu);
                let totalAmount = 0;

                let totalTimeInHours: number = 0;
                if (startTime.includes("h30")) {
                    totalTimeInHours = Math.abs(endHour - hours) + (endMinute / 60) - 0.5;
                    if (totalTimeInHours == 0.5) {
                        totalAmount = selectedPrice / 2;
                    } else if (String(totalTimeInHours).includes(".5")) {
                        totalAmount = (selectedPrice * Math.abs(endHour - hours)) - selectedPrice / 2;
                    } else {
                        totalAmount = selectedPrice * totalTimeInHours;
                    }
                } else {
                    totalTimeInHours = (Math.abs(endHour - hours) + (endMinute / 60));
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
                setPrepayPrice(totalAmount * (sportDetail?.percentDeposit / 100));
            }
        }
    }



    const handleSave = async () => {
        const paymentMethod = dataPaymentMethod?.find(method => method.paymentMethodId === paymentMethodId);
        if (!paymentMethod) {
            toast.error("Phương thức thanh toán không hợp lệ!");
            return;
        }
        await createBooking(paymentMethod);
        setCheckDataStatus(!checkDataStatus);
        handleClose();
    }

    useEffect(() => {
        setStartDate(new Date(dayStartBooking));
        setEndDate(new Date(new Date(dayStartBooking).setDate(new Date(dayStartBooking).getDate() + 13)))
    }, [dayStartBooking, activeTab])

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [weekDays, setWeekDays] = useState<DateType>({});
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [dataTimeOnStage, setDataTimeOnStage] = useState<string[]>([]);

    const renderWeekDay = () => {
        const days: DateType = {};
        const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        let differenceInDays = 0;

        if (startDate && endDate) {
            const differenceInTime = endDate.getTime() - startDate.getTime();
            differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
        }

        if (differenceInDays >= 0 && startDate && endDate) {
            for (let i = 0; i <= differenceInDays; i++) {
                const nextDay = new Date(startDate);
                nextDay.setDate(startDate.getDate() + i);

                const day = nextDay.getDate().toString().padStart(2, '0');
                const month = (nextDay.getMonth() + 1).toString().padStart(2, '0');
                const weekday = weekdays[nextDay.getDay()];

                if (!days[weekday]) {
                    days[weekday] = {};
                }

                if (!days[weekday][i]) {
                    days[weekday][i] = [];
                }

                days[weekday][i].push({ date: `${nextDay.getFullYear()}-${month}-${day}` });
            }
        }

        setWeekDays(days);
    };

    useEffect(() => {
        setSportFieldDuplicate({});
        setWeekDays({});
        setSelectedWeek([]);
        createTimeByTimeOnStage();
        if (startDate && endDate && selectTimeOnStage != 'Chọn thời gian') {
            renderWeekDay();
        }
    }, [startDate, endDate, selectTimeOnStage])

    const createTimeByTimeOnStage = () => {
        const getTime = startTime.match(/(\d+)h(\d+)/);
        const startHours = getTime ? Number(getTime[1]) : 0;
        const startMinutes = getTime ? Number(getTime[2]) : 0;

        const timeParts = selectTimeOnStage.split(' ');
        const getHour = timeParts[0] == '30' ? 0 : Number(timeParts[0]);
        const getMinute = Number(timeParts[2]) | 0;
        const numberOfSlots = (getHour * 60 + getMinute);

        const timeSlots = [];

        let currentHours = startHours;
        let currentMinutes = startMinutes;
        if (selectTimeOnStage == '30 phút') {
            timeSlots.push(startTime);
            if (startTime.includes('h30')) {
                timeSlots.push(startHours + 1 + 'h00')
            } else {
                timeSlots.push(startHours + 'h30')
            }
        } else {
            for (let i = 0; i <= Math.ceil(numberOfSlots) / 30; i++) {
                timeSlots.push(`${currentHours}h${currentMinutes === 0 ? '00' : currentMinutes}`);
                currentMinutes += 30;

                if (currentMinutes >= 60) {
                    currentHours += Math.floor(currentMinutes / 60);
                    currentMinutes = currentMinutes % 60;
                }
            }
        }
        setEndTime(timeSlots[timeSlots.length - 1]);
        setDataTime(['1 giờ', '1 giờ 30 phút', '2 giờ', '2 giờ 30 phút', '3 giờ']);
        timeSlots.pop();
        setDataTimeOnStage(timeSlots);
    };

    const [selectedWeek, setSelectedWeek] = useState<string[]>([]);
    const [sportFieldDuplicate, setSportFieldDuplicate] = useState<WeekBookingDetail>({});

    useEffect(() => {
        let index = 0;
        for (const week of selectedWeek) {
            const dateWeek = weekDays[week];
            for (const [weekIndex, bookings] of Object.entries(dateWeek)) {
                bookings.map(b => {
                    index = index + 1;
                })
            }
        }
        if (price) {
            setTotalAmount(price * index);
        }
    }, [selectedWeek])

    const getWeekDate = async (weekDate: string) => {
        const dateWeek = weekDays[weekDate];
        if (!selectedWeek.includes(weekDate)) {
            for (const [weekIndex, bookings] of Object.entries(dateWeek)) {
                for (const booking of bookings) {
                    try {
                        const response = await fetch(
                            `http://localhost:8080/rest/user/booking/detail/getbyday/${sportDetail?.sportFielDetailId}/${booking.date}`
                        );

                        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
                        const text = await response.text();

                        if (text) {
                            const dataBooking = JSON.parse(text) as BookingDetail[];
                            if (dataBooking && Object.keys(dataBooking).length > 0) {
                                for (const item of dataBooking) {
                                    for (const time of dataTimeOnStage) {
                                        const result = isTimeWithinRange(item.startTime, item.endTime, time);
                                        if (result) {
                                            setSportFieldDuplicate(prevState => ({
                                                ...prevState,
                                                [weekDate]: prevState[weekDate]
                                                    ? prevState[weekDate].some(existingItem => existingItem === item)
                                                        ? prevState[weekDate]
                                                        : [...prevState[weekDate], item]
                                                    : [item],
                                            }));
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
            setSelectedWeek(prevSelectedWeek => [...prevSelectedWeek, weekDate]);
        } else {
            setSelectedWeek(prevSelectedWeek => prevSelectedWeek.filter(date => date !== weekDate));
            setSportFieldDuplicate(prevSportFieldDuplicate => {
                const newState = { ...prevSportFieldDuplicate };
                if (prevSportFieldDuplicate[weekDate]) {
                    delete newState[weekDate];
                    return newState;
                }
                return prevSportFieldDuplicate;
            })
        }
    }

    const isTimeWithinRange = (startTime: string, endTime: string, checkTime: string): boolean => {
        const [startHours, startMinutes] = startTime.split('h').map(Number);
        const [endHours, endMinutes] = endTime.split('h').map(Number);
        const [checkHours, checkMinutes] = checkTime.split('h').map(Number);

        const startDate = new Date(0, 0, 0, startHours, startMinutes);
        const endDate = new Date(0, 0, 0, endHours, endMinutes);
        const checkDate = new Date(0, 0, 0, checkHours, checkMinutes);
        return checkDate >= startDate && checkDate <= endDate;
    }

    const handleSaveByPeriod = async () => {
        const paymentMethod = dataPaymentMethod?.find(method => method.paymentMethodId === paymentMethodId);
        if (!paymentMethod) {
            toast.error("Phương thức thanh toán không hợp lệ!");
            return;
        }
        createBookingByPeriod(paymentMethod);
        setCheckDataStatus(!checkDataStatus);
        handleClose();
    }

    const createBooking = async (paymentMethod: PaymentMethod) => {
        const responseBooking = await fetch('http://localhost:8080/rest/booking', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userData?.username,
                fullName: userData?.fullname,
                phoneNumber: userData?.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber,
                totalAmount,
                prepayPrice: checkPrepayPrice ? prepayPrice : totalAmount,
                paymentMethodId: paymentMethod.paymentMethodId,
                ownerId: owner?.ownerId,
                status: checkPrepayPrice ? "Chờ thanh toán" : "Đã thanh toán",
                voucher: null,
                checkOwner: "user"
            })
        })

        const resBooking = await responseBooking.json() as Booking;

        await fetch('http://localhost:8080/rest/booking/detail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTime,
                endTime,
                sportFieldDetailId: sportDetail?.sportFielDetailId,
                price,
                date: dayStartBooking,
                booking: resBooking.bookingId,
                subscriptionKey: activeTab !== 'byDay' ? 'createKey' : null
            })
        });
        toast.success("Đặt sân thành công!");
    }

    const createBookingByPeriod = async (paymentMethod: PaymentMethod) => {
        if (!sportDetail) {
            toast.error("Thông tin sân không hợp lệ!");
            return;
        }
        const responseBooking = await fetch('http://localhost:8080/rest/booking', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userData?.username,
                fullName: userData?.fullname,
                phoneNumber: userData?.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber,
                totalAmount,
                prepayPrice: checkPrepayPrice ? totalAmount && totalAmount * (sportDetail.percentDeposit / 100) : totalAmount,
                paymentMethodId: paymentMethod.paymentMethodId,
                ownerId: owner?.ownerId,
                status: checkPrepayPrice ? "Chờ thanh toán" : "Đã thanh toán",
                voucher: null,
                checkOwner: "user"
            })
        })

        const resBooking = await responseBooking.json() as Booking;

        for (const week of selectedWeek) {
            const dateWeek = weekDays[week];
            for (const [weekIndex, bookings] of Object.entries(dateWeek)) {
                bookings.map(async b => {
                    await fetch('http://localhost:8080/rest/booking/detail', {
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
                            date: b.date,
                            booking: resBooking.bookingId,
                            subscriptionKey: activeTab !== 'byDay' ? `keybooking${resBooking.bookingId}` : ""
                        })
                    });
                })
            }
        }
        toast.success("Đặt sân thành công!");
    }

    const handleClose = () => {
        setShowBookingModal(false);
        setOperatingTime(0);
        setOperatingTimeFetchData(0);
        setTotalAmount(0);
        setPrice(0);
        setWeekDays({});
        setSelectedWeek([]);
        setActiveTab("byDay");
        setSportFieldDuplicate({});
        setSelectTime("Chọn thời gian");
        setSelectTimeOnStage("Chọn thời gian")
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckPrepayPrice(event.target.value === 'prepay');
    };

    const calculateBookingPrice = (sportDetail: any, startTime: any, endTime: any) => {
        const { peakHour, peakHourPrices, price } = sportDetail;

        const [peakStart, peakEnd] = peakHour.split('-');
        const [peakStartHour, peakStartMin] = peakStart.split('h').map(Number);
        const [peakEndHour, peakEndMin] = peakEnd.split('h').map(Number);

        const [timeStartHour, timeStartMin] = startTime.split('h').map(Number);

        if (!endTime) {
            return price;
        }
        const [timeEndHour, timeEndMin] = endTime.split('h').map(Number);

        const peakStartInMinutes = peakStartHour * 60 + peakStartMin;
        const peakEndInMinutes = peakEndHour * 60 + peakEndMin;

        const startTimeInMinutes = timeStartHour * 60 + timeStartMin;
        const endTimeInMinutes = timeEndHour * 60 + timeEndMin;

        const isPeakHour = (
            (startTimeInMinutes >= peakStartInMinutes && startTimeInMinutes < peakEndInMinutes) ||
            (endTimeInMinutes > peakStartInMinutes && endTimeInMinutes <= peakEndInMinutes) ||
            (startTimeInMinutes < peakStartInMinutes && endTimeInMinutes > peakEndInMinutes)
        );

        return isPeakHour ? peakHourPrices : price;
    };

    const renderSportFieldInfor = () => {
        return (
            <>
                <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin {sportDetail && sportDetail.name}</h6>
                <ul>
                    <li><span className="fw-bold">Giá đặt sân / 1h:</span> {formatPrice(sportDetail && sportDetail.price)}.</li>
                    <li><span className="fw-bold">Giá đặt sân giờ vàng / 1h:</span> {formatPrice(sportDetail && sportDetail.peakHourPrices)}.</li>
                    <li><span className="fw-bold">Giờ vàng:</span> {sportDetail && sportDetail.peakHour}.</li>
                    <li><span className="fw-bold">Kích thước sân:</span> {sportDetail && sportDetail.size}.</li>
                    <li><span className="fw-bold">Trạng thái:</span> {sport && sport.status}.</li>
                    <li><span className="fw-bold">Địa chỉ:</span> {sport && sport.address}.</li>
                </ul>
            </>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'byDay':
                const priceForByDay = sportDetail ? calculateBookingPrice(sportDetail, startTime, endTime) : null;
                return (
                    <>
                        <Row>
                            <Col>
                                {renderSportFieldInfor()}
                            </Col>
                            <Col>
                                <div className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</div>
                                <InputGroup className="mb-2">
                                    <FloatingLabel controlId="floatingUsername" label="Họ và tên" className="flex-grow-1">
                                        <Form.Control type="text" value={userData?.fullname} readOnly />
                                    </FloatingLabel>
                                </InputGroup>
                                <FloatingLabel controlId="floatingSelectTime" label="Thời gian đá" className="mb-2">
                                    <Form.Select value={selectTime} onChange={(e) => setSelectTime(e.target.value)}>
                                        <option value="Chọn thời gian">Chọn thời gian</option>
                                        {dataTime && dataTime.map((time, index) => (
                                            <option key={index} value={String(time)}>{time}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingPaymentMethod" label={<span>Phương thức thanh toán <span className="text-danger">*</span></span>}>
                                    <Form.Select value={paymentMethodId} onChange={(e) => setPaymentMethodId(Number(e.target.value))}>
                                        <option value="0">Chọn phương thức thanh toán</option>
                                        {dataPaymentMethod && dataPaymentMethod.map((item) => (
                                            <option key={item.paymentMethodId} value={item.paymentMethodId}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <h6 className="text-uppercase text-danger fw-bold text-center my-2">Thông tin đặt sân</h6>
                        <div className="d-flex align-items-center justify-content-center mt-2">
                            <div className="form-check me-5">
                                <input value="prepay" checked={checkPrepayPrice} onChange={handleRadioChange}
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Trả trước {sportDetail?.percentDeposit}%
                                </label>
                            </div>
                            <div className="form-check">
                                <input value="full" checked={!checkPrepayPrice} onChange={handleRadioChange}
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Trả 100%
                                </label>
                            </div>
                        </div>
                        <Row>
                            <Col className="px-5 text-center">
                                <span><b> Ngày đặt: </b>{dayStartBooking}. </span><br />
                                <span><b> Thời gian đá: </b>{startTime} - {endTime ? endTime : '???'}</span><br />
                            </Col>
                            <Col className="px-5 text-center">
                                <span><b>Đơn giá: </b> <em className="text-danger">{endTime ? `${priceForByDay?.toLocaleString()} đ` : 'Vui lòng chọn thời gian đá'}</em>. </span><br />
                                <span><b>Tổng tiền: </b><em className="text-danger">{price ? `${price?.toLocaleString()} đ` : 'Vui lòng chọn thời gian đá'}</em>. </span><br />
                            </Col>
                        </Row>
                    </>
                );
            case 'byPeriod':
                const priceForByPeriod = sportDetail ? calculateBookingPrice(sportDetail, startTime, endTime) : null;
                return (
                    <>
                        <Row>
                            <Col>
                                {renderSportFieldInfor()}
                            </Col>
                            <Col>
                                <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</h6>
                                <InputGroup className="mb-2">
                                    <FloatingLabel controlId="floatingUsername" label="Họ và tên" className="flex-grow-1">
                                        <Form.Control type="text" value={userData?.fullname} readOnly />
                                    </FloatingLabel>
                                </InputGroup>
                                <FloatingLabel controlId="floatingPaymentMethod" label={<span>Phương thức thanh toán <span className="text-danger">*</span></span>}>
                                    <Form.Select value={paymentMethodId} onChange={(e) => setPaymentMethodId(Number(e.target.value))}>
                                        <option value="0">Chọn phương thức thanh toán</option>
                                        {dataPaymentMethod && dataPaymentMethod.map((item) => (
                                            <option key={item.paymentMethodId} value={item.paymentMethodId}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <h6 className="text-uppercase text-danger fw-bold text-center mt-3">Thời gian</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <InputGroup className="search-date mb-2">
                                <DatePicker selected={startDate || undefined} onChange={(date) => setStartDate(date)} selectsStart
                                    startDate={startDate || undefined} endDate={endDate || undefined} minDate={new Date(dayStartBooking)}
                                    placeholderText="Từ ngày" className="form-control start" dateFormat="dd/MM/yyyy" />
                                <InputGroup.Text><i className="bi bi-three-dots"></i></InputGroup.Text>
                                <DatePicker selected={endDate || undefined} onChange={(date) => setEndDate(date)} selectsEnd
                                    startDate={startDate || undefined} endDate={endDate || undefined}
                                    minDate={startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 13)) : undefined}
                                    maxDate={startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 30)) : undefined}
                                    placeholderText="Đến ngày" className="form-control end" dateFormat="dd/MM/yyyy" />
                            </InputGroup>
                            <InputGroup className="search-date mb-2">
                                <Form.Control value={startTime} onChange={(e) => undefined} placeholder="Thời gian bắt đầu" />
                                <Form.Select style={{ border: '1px solid' }} value={selectTimeOnStage} className="me-3"
                                    onChange={(e) => setSelectTimeOnStage(e.target.value)}>
                                    <option value="Chọn thời gian">Chọn thời gian đá</option>
                                    <option value="1 giờ">1 giờ</option>
                                    <option value="1 giờ 30 phút">1 giờ 30 phút</option>
                                    <option value="2 giờ">2 giờ</option>
                                    <option value="2 giờ 30 phút">2 giờ 30 phút</option>
                                    <option value="3 giờ">3 giờ</option>
                                </Form.Select>
                            </InputGroup>
                        </div>
                        <Row className="text-center mx-4">
                            {weekDays && Object.entries(weekDays).map(([weekday, weeks]) => (
                                <Col onClick={() => getWeekDate(weekday)} key={weekday}
                                    className={`col-day border p-2 text-white ${selectedWeek.includes(weekday) ? 'active' : ''}`}>
                                    <b>{weekday}</b>
                                    {Object.entries(weeks).map(([index, details]) => (
                                        <div key={index}>
                                            {details.map((detail, i) => (
                                                <span key={i}>{formatDateNotime(detail.date)}</span>
                                            ))}
                                        </div>
                                    ))}
                                </Col>
                            ))}
                        </Row>
                        {Object.entries(sportFieldDuplicate).map(([week, bookings]) => (
                            <div key={week} className="bg-dark p-2 text-center mx-4 mt-2 text-light">
                                <b className="text-uppercase">Đã có sân đặt vào {week}</b><br />
                                {bookings.map((booking) => (
                                    <div key={booking.bookingDetailId}>
                                        Ngày: {formatDateNotime(booking.date)}  Giờ: {booking.startTime} - {booking.endTime}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="d-flex align-items-center justify-content-center mt-2">
                            <div className="form-check me-5">
                                <input value="prepay" checked={checkPrepayPrice} onChange={handleRadioChange}
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Trả trước {sportDetail?.percentDeposit}%
                                </label>
                            </div>
                            <div className="form-check">
                                <input value="full" checked={!checkPrepayPrice} onChange={handleRadioChange}
                                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Trả 100%
                                </label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-around mt-2">
                            <span><b> Thời gian đá: </b>{startTime} - {endTime ? endTime : '???'}</span>
                            <span><b>Đơn giá: </b> <em className="text-danger">{endTime ? `${priceForByPeriod?.toLocaleString()} đ` : 'Vui lòng chọn thời gian đá'}</em>. </span>
                            <span><b>Trả trước: </b> <em className="text-danger">{sportDetail && totalAmount ? (totalAmount * (sportDetail.percentDeposit / 100)).toLocaleString() : '???'} ₫</em>. </span>
                            <span><b>Tổng tiền: </b><em className="text-danger">{totalAmount ? totalAmount.toLocaleString() : '???'} ₫</em>. </span>
                        </div>
                    </>
                );
            default:
                return (
                    <div className="font-14">
                        Loading...
                    </div>
                );
        }
    };

    return (
        <>
            <Modal show={showBookingModal} onHide={() => handleClose()} size="xl" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)}
                    className="custom-tabs mb-3 mx-2">
                    <Nav.Item>
                        <Nav.Link eventKey="byDay" className="tab-link">ĐẶT SÂN THEO NGÀY</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="byPeriod" className="tab-link">ĐẶT SÂN THEO KỲ</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Modal.Body className="pt-0">
                    {renderContent()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Hủy
                    </Button>
                    {activeTab === 'byDay' ?
                        <Button style={{ backgroundColor: "#142239" }}
                            onClick={() => handleSave()}>Xác nhận</Button>
                        :
                        <Button style={{ backgroundColor: "#142239" }}
                            disabled={Object.keys(sportFieldDuplicate).length === 0 && selectedWeek.length !== 0 ? false : true}
                            onClick={() => handleSaveByPeriod()}>Xác nhận</Button>
                    }
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default BookingModal;