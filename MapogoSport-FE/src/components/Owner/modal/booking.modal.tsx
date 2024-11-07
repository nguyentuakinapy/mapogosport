import { formatPrice } from "@/components/Utils/Format";
import { use, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup, Nav } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import 'react-datepicker/dist/react-datepicker.css';
import { time } from "console";


interface BookingProps {
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

const BookingModal = (props: BookingProps) => {
    const { showBookingModal, setShowBookingModal, sportDetail, startTime,
        dayStartBooking, sport, owner, checkDataStatus, setCheckDataStatus, startTimeKey } = props;

    const [selectTime, setSelectTime] = useState<string>('Chọn thời gian');
    const [selectTimeOnStage, setSelectTimeOnStage] = useState<string>('Chọn thời gian');
    const [isOffline, setIsOffline] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('all');

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
    const [fullName, setFullName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");

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
    const [dataTimeTemporary, setDataTimeTemporary] = useState<String[]>();

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
        setDataTimeTemporary(newData);
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
        if (slTime) {
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
                console.log(totalAmount);
            }
        }
    }



    const handleSave = async () => {
        const paymentMethod = dataPaymentMethod?.find(method => method.paymentMethodId === paymentMethodId);
        if (isOffline) {
            if (!fullName) {
                toast.error("Vui lòng nhập họ và tên!");
                return;
            } else if (!phoneNumber) {
                toast.error("Vui lòng nhập số điện thoại!");
                return;
            } else if (selectTime === "Chọn thời gian") {
                toast.error("Vui lòng chọn thời gian!");
                return;
            } else if (!paymentMethod) {
                toast.error("Phương thức thanh toán không hợp lệ!");
                return;
            }
        } else {
            if (!username) {
                toast.error("Vui lòng nhập tên đăng nhập!");
                return;
            } else if (!paymentMethod) {
                toast.error("Phương thức thanh toán không hợp lệ!");
                return;
            }
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

    useEffect(() => {
        setStartDate(new Date(dayStartBooking));
        setEndDate(new Date(new Date(dayStartBooking).setDate(new Date(dayStartBooking).getDate() + 14)))
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
            // toast.success(`Khoảng cách: ${differenceInDays} ngày`);
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

        console.log(days);
        setWeekDays(days); // Cập nhật state với các ngày trong tuần
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
        toast.success(numberOfSlots == 0 ? 1 : numberOfSlots);

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
        setDataTime(['30 phút', '1 giờ', '1 giờ 30 phút', '2 giờ', '2 giờ 30 phút', '3 giờ']);
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
                    console.log('b', b.date);
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
                        // console.log(text);

                        if (text) {
                            const dataBooking = JSON.parse(text) as BookingDetail[];
                            if (dataBooking && Object.keys(dataBooking).length > 0) {
                                for (const item of dataBooking) {
                                    for (const time of dataTimeOnStage) {
                                        const result = isTimeWithinRange(item.startTime, item.endTime, time);
                                        toast.warning(result);
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

        // Tạo đối tượng Date cho từng thời gian
        const startDate = new Date(0, 0, 0, startHours, startMinutes);
        const endDate = new Date(0, 0, 0, endHours, endMinutes);
        const checkDate = new Date(0, 0, 0, checkHours, checkMinutes);

        // Kiểm tra thời gian nằm trong khoảng
        return checkDate >= startDate && checkDate <= endDate;
    }

    const handleSaveByPeriod = async () => {
        const paymentMethod = dataPaymentMethod?.find(method => method.paymentMethodId === paymentMethodId);

        if (isOffline) {
            if (!fullName) {
                toast.error("Vui lòng nhập họ và tên!");
                return;
            } else if (!phoneNumber) {
                toast.error("Vui lòng nhập số điện thoại!");
                return;
            } else if (!paymentMethod) {
                toast.error("Phương thức thanh toán không hợp lệ!");
                return;
            }
        } else {
            if (!username) {
                toast.error("Vui lòng nhập tên đăng nhập!");
                return;
            } else if (!paymentMethod) {
                toast.error("Phương thức thanh toán không hợp lệ!");
                return;
            }
        }

        if (isOffline) {
            const responseUser = await fetch(`http://localhost:8080/rest/user/sportoffline`);
            if (!responseUser.ok) {
                throw new Error('Error fetching data');
            }
            const dataUser = await responseUser.json() as User;
            createBookingByPeriod(paymentMethod, dataUser);
        } else {
            const responseUser = await fetch(`http://localhost:8080/rest/user/${username}`);
            if (!responseUser.ok) {
                toast.error('Tên người dùng không tồn tại!');
                return;
            }
            const dataUser = await responseUser.json() as User;
            createBookingByPeriod(paymentMethod, dataUser);
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
                fullName: isOffline ? fullName : dataUser.fullname,
                phoneNumber: isOffline ? phoneNumber : dataUser.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber,
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
                booking: resBooking.bookingId,
                subscriptionKey: activeTab !== 'all' ? 'createKey' : null
            })
        });
        const resBookingDetail = await responseBookingDetail.json() as BookingDetail;

        toast.success("Đặt sân thành công!");
    }

    const createBookingByPeriod = async (paymentMethod: PaymentMethod, dataUser: User) => {
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
                fullName: isOffline ? fullName : dataUser.fullname,
                phoneNumber: isOffline ? phoneNumber : dataUser.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber,
                totalAmount,
                paymentMethodId: paymentMethod.paymentMethodId,
                ownerId: owner.ownerId,
                status: statusBooking,
                voucher: null,
                note
            })
        })

        const resBooking = await responseBooking.json() as Booking;

        for (const week of selectedWeek) {
            const dateWeek = weekDays[week];
            for (const [weekIndex, bookings] of Object.entries(dateWeek)) {
                bookings.map(async b => {
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
                            date: b.date,
                            booking: resBooking.bookingId,
                            subscriptionKey: activeTab !== 'all' ? `keybooking${resBooking.bookingId}` : ""
                        })
                    });
                    const resBookingDetail = await responseBookingDetail.json() as BookingDetail;
                })
            }
        }
        toast.success("Đặt sân thành công!");
    }

    const handleClose = () => {
        setShowBookingModal(false);
        setUsername("");
        setOperatingTime(0);
        setOperatingTimeFetchData(0);
        setTotalAmount(0);
        setPrice(0);
        // setStartDate(null);
        // setEndDate(null);
        setWeekDays({});
        setSelectedWeek([]);
        setActiveTab("all");
        setSportFieldDuplicate({});
        setSelectTime("Chọn thời gian");
        setIsOffline(false);
        setFullName("");
        setPhoneNumber("");
        setSelectTimeOnStage("Chọn thời gian")
    }

    useEffect(() => {
        setUsername("");
        setOperatingTime(0);
        setOperatingTimeFetchData(0);
        setTotalAmount(0);
        setPrice(0);
        // setStartDate(null);
        // setEndDate(null);
        setWeekDays({});
        setSelectedWeek([]);
        setSportFieldDuplicate({});
        setSelectTime("Chọn thời gian");
        setIsOffline(false);
        setFullName("");
        setPhoneNumber("");
    }, [activeTab])

    const renderInputBooking = () => {
        return (
            <>
                <InputGroup className="mb-2">
                    {isOffline ? (
                        <FloatingLabel controlId="floatingUsername" label="Họ và tên!" className="flex-grow-1">
                            <Form.Control
                                type="text"
                                placeholder="Vui lòng nhập tên đăng nhập!"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </FloatingLabel>
                    ) : (
                        <FloatingLabel controlId="floatingFullName" label="Vui lòng nhập tên đăng nhập!" className="flex-grow-1">
                            <Form.Control
                                type="text"
                                placeholder="Vui lòng nhập tên đăng nhập!"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FloatingLabel>
                    )}
                    <InputGroup.Text aria-label="Checkbox for following text input bg-white">
                        <Form.Check
                            type="checkbox"
                            label="Offline"
                            checked={isOffline}
                            onChange={(e) => setIsOffline(e.target.checked)}
                        />
                    </InputGroup.Text>
                </InputGroup>

                {isOffline && (
                    <FloatingLabel controlId="floatingPhoneNumber" label="Số điện thoại!" className="flex-grow-1 mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Vui lòng nhập tên đăng nhập!"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </FloatingLabel>
                )}
            </>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return (
                    <>
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
                                {renderInputBooking()}
                                <FloatingLabel controlId="floatingSelectTime" label="Chọn thời gian" className="mb-2">
                                    <Form.Select
                                        value={selectTime}
                                        onChange={(e) => setSelectTime(e.target.value)}
                                        aria-label="Default select example"
                                    >
                                        <option value="Chọn thời gian">Chọn thời gian</option>
                                        {dataTimeTemporary && dataTimeTemporary.map((time, index) => (
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
                    </>
                );
            case 'deposit':
                return (
                    <>
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
                                {renderInputBooking()}
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
                        <h6 className="text-uppercase text-danger fw-bold text-center mt-3">Thời gian</h6>
                        <div className="d-flex">
                            <InputGroup className="search-date mb-2">
                                <DatePicker
                                    selected={startDate || undefined}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate || undefined}
                                    endDate={endDate || undefined}
                                    minDate={new Date(dayStartBooking)}
                                    placeholderText="Từ ngày"
                                    className="form-control start"
                                    dateFormat="dd/MM/yyyy"
                                />
                                <InputGroup.Text><i className="bi bi-three-dots"></i></InputGroup.Text>
                                <DatePicker
                                    selected={endDate || undefined}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate || undefined}
                                    endDate={endDate || undefined}
                                    minDate={startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 14)) : undefined}
                                    maxDate={startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 30)) : undefined}
                                    placeholderText="Đến ngày"
                                    className="form-control end"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </InputGroup>
                            <InputGroup className="search-date mb-2">
                                <Form.Control
                                    value={startTime}
                                    onChange={(e) => undefined}
                                    placeholder="Thời gian bắt đầu"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                                <Form.Select value={selectTimeOnStage} className="me-3"
                                    onChange={(e) => setSelectTimeOnStage(e.target.value)} aria-label="Default select example">
                                    <option value="Chọn thời gian">Chọn thời gian</option>
                                    <option value="30 phút">30 phút</option>
                                    <option value="1 giờ">1 giờ</option>
                                    <option value="1 giờ 30 phút">1 giờ 30 phút</option>
                                    <option value="2 giờ">2 giờ</option>
                                    <option value="2 giờ 30 phút">2 giờ 30 phút</option>
                                    <option value="3 giờ">3 giờ</option>
                                    {/* {dataTime && dataTime.map((time, index) => (
                                        <option key={index} value={String(time)}>{time}</option>
                                    ))} */}
                                </Form.Select>
                            </InputGroup>
                        </div>
                        <Row className="text-center mx-4">
                            {weekDays && Object.entries(weekDays).map(([weekday, weeks]) => (
                                <Col onClick={() => getWeekDate(weekday)} key={weekday}
                                    // style={{ backgroundColor: Object.entries(sportFieldDuplicate). ? 
                                    // '#ff1f8c' : undefined }}
                                    className={`col-day border p-2 text-white ${selectedWeek.includes(weekday) ? 'active' : ''}`}>
                                    <b>{weekday}</b>
                                </Col>
                            ))}
                        </Row>
                        {Object.entries(sportFieldDuplicate).map(([week, bookings]) => (
                            <div key={week} className="bg-dark p-2 text-center mx-4 mt-2 text-light">
                                <b className="text-uppercase">Đã có sân đặt vào {week}</b><br />
                                {bookings.map((booking, index) => (
                                    <div key={booking.bookingDetailId}>
                                        Ngày: {booking.date}  Giờ: {booking.startTime} - {booking.endTime}  {/* Có thể hiển thị thêm thông tin khác ở đây */}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="d-flex justify-content-around mt-2">
                            <span><b>Đơn giá: </b> <em className="text-danger">{sportDetail?.price.toLocaleString("vi-VN", { style: "currency", currency: "VND", })}</em>. </span>
                            <span><b>Tổng tiền: </b><em className="text-danger">{totalAmount ? totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND", }) : '???'}</em>. </span>
                        </div>
                        <Form.Group className="mt-2 px-4">
                            <Form.Control as="textarea" rows={3}
                                type="text"
                                placeholder="Ghi chú!"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </Form.Group>
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
                        <Nav.Link eventKey="all" className="tab-link">ĐẶT SÂN THEO NGÀY</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="deposit" className="tab-link">ĐẶT SÂN THEO KỲ</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Modal.Body className="pt-0">
                    {renderContent()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Hủy
                    </Button>
                    {activeTab === 'all' ?
                        <Button style={{ backgroundColor: "#142239" }}
                            onClick={() => handleSave()}>Xác nhận</Button>
                        :
                        <Button style={{ backgroundColor: "#142239" }}
                            disabled={Object.keys(sportFieldDuplicate).length === 0 && selectedWeek.length !== 0 ? false : true}
                            onClick={() => handleSaveByPeriod()}>Xác nhận 1</Button>
                    }
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default BookingModal;