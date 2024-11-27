import { formatDateNotime } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup, Nav } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import 'react-datepicker/dist/react-datepicker.css';
import { createTimeStringH, isDateInRange } from "@/components/Utils/booking-time";


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
    startTimeKey: number
}

const BookingModal = (props: BookingProps) => {
    const { showBookingModal, setShowBookingModal, sportDetail, startTime,
        dayStartBooking, sport, owner, checkDataStatus, setCheckDataStatus, startTimeKey } = props;
    const [selectTime, setSelectTime] = useState<string>('Chọn thời gian');
    const [selectTimeOnStage, setSelectTimeOnStage] = useState<string>('Chọn thời gian');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [checkPrepayPrice, setCheckPrepayPrice] = useState<boolean>(true);
    const [totalAmount, setTotalAmount] = useState<number>();
    const [fullName, setFullName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    // BOOKING DETAIL
    const [endTime, setEndTime] = useState<string>();
    const [price, setPrice] = useState<number>();

    const [dataTime, setDataTime] = useState<string[]>();
    const [dataTimeTemporary, setDataTimeTemporary] = useState<string[]>();

    useEffect(() => {
        const checkAndCreateTimeBooking = async () => {
            if (!startTime || !dayStartBooking || !sportDetail || !sport) return;

            let operatingTime: number = 0;

            if (startTime && sport.closing) {
                console.log(startTime, sport.closing);

                const [openHour, openMinute] = startTime.split("h").map(Number);
                const [closeHour, closeMinute] = sport.closing.split("h").map(Number);
                const totalOpenMinutes = openHour * 60 + openMinute;
                const totalCloseMinutes = closeHour * 60 + closeMinute;
                operatingTime = ((totalCloseMinutes - totalOpenMinutes) / 60);
            }

            const newData = [startTime];
            for (let i = 0; i < operatingTime * 2; i++) {
                const getTime = newData[i].match(/\d+/);
                if (getTime) {
                    const hour = Number(getTime[0]);
                    newData.push(newData[i].includes("h30") ? `${hour + 1}h00` : `${hour}h30`);
                }
            }

            let count = 0;
            let hourStart;
            let minuteStart;
            let hourEnd;
            let minuteEnd;

            for (const time of newData) {
                if (count >= 6) {
                    break;
                }

                try {
                    const response = await fetch(
                        `http://localhost:8080/rest/booking/detail/findbystarttime/sportfielddetail/${time}/${sportDetail.sportFielDetailId}/${dayStartBooking}`
                    );

                    if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);

                    const text = await response.text();
                    if (text) {
                        const dataBooking = JSON.parse(text);
                        if (dataBooking && Object.keys(dataBooking).length > 0) {
                            break;
                        }
                    }
                } catch (error) {
                    console.error("API or JSON parsing error:", error);
                }

                count++;
            }
            for (const s of sportDetail.statusSportFieldDetails) {
                if (isDateInRange(dayStartBooking, s.startDate, s.endDate)) {
                    let check = false;
                    let checkFetch = false;
                    let countTemporary = 0;
                    if (sport) {
                        if (s.statusName !== "Hoạt động" && new Date(s.startDate).toISOString().split("T")[0] === dayStartBooking) {
                            if (new Date(s.startDate).getMinutes() > 30) {
                                hourStart = new Date(s.startDate).getHours() + 1;
                                minuteStart = '00';
                            } else {
                                hourStart = new Date(s.startDate).getHours();
                                minuteStart = '30';
                            }
                            // toast.success(s.startDate)

                            const currentStartTime = `${hourStart}h${minuteStart}`;
                            const timeStringH: string[] = createTimeStringH(
                                currentStartTime,
                                sport.closing
                            );

                            if (new Date(s.endDate).getTime() <= new Date().getTime()) {
                                break;
                            }

                            for (const time of newData) {
                                if (countTemporary >= 6) {
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
                                            checkFetch = true;
                                            break;
                                        }
                                    }
                                } catch (error) {
                                    console.error("API or JSON parsing error:", error);
                                }
                                const result = timeStringH.includes(time);
                                if (!result) {
                                    // toast.success(time)
                                    countTemporary++;
                                    check = true;
                                }
                            }
                        } else if (s.statusName !== "Hoạt động" && new Date(s.endDate).toISOString().split("T")[0] === dayStartBooking) {
                            if (new Date(s.endDate).getMinutes() > 30) {
                                hourEnd = new Date(s.endDate).getHours() + 1;
                                minuteEnd = '00';
                            } else {
                                hourEnd = new Date(s.endDate).getHours();
                                minuteEnd = '30';
                            }

                            const currentEndTime = `${hourEnd}h${minuteEnd}`;
                            const timeStringH: string[] = createTimeStringH(
                                sport.opening,
                                currentEndTime
                            );

                            if (new Date(s.startDate).getTime() >= new Date().getTime()) {
                                break;
                            }

                            if (timeStringH.includes(startTime)) {
                                for (const time of newData) {
                                    if (countTemporary >= 6) {
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
                                                checkFetch = true;
                                                break;
                                            }
                                        }
                                    } catch (error) {
                                        console.error("API or JSON parsing error:", error);
                                    }
                                    const result = timeStringH.includes(time);
                                    if (!result) {
                                        countTemporary++;
                                        check = true;
                                    }
                                }
                            }
                        }
                    }

                    if (checkFetch) {
                        count = countTemporary;
                        break;
                    } else if (check) {
                        count = countTemporary - 2;
                        break;
                    }
                }
            }

            const newDataTime: string[] = [];
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
            for (let index = 0; index < count; index++) {
                newDataTime.push(timeIntervals[index].label);
            }
            if (activeTab === 'all') {

                newDataTime.shift()
                setDataTimeTemporary(newDataTime);
            }
        }
        checkAndCreateTimeBooking();
    }, [startTimeKey, startTime, dayStartBooking, sportDetail, activeTab, sport]);


    useEffect(() => {
        getPriceByTimeBooking(selectTime);
    }, [selectTime, sportDetail]);

    useEffect(() => {
        getPriceByTimeBooking(selectTimeOnStage);
    }, [selectTimeOnStage, sportDetail]);

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

                const peakHourStart = sportDetail.peakHour.split('-')[0];
                const peakHourEnd = sportDetail.peakHour.split('-')[1];

                const timeSlots: string[] = createTimeStringH(`${hours}h${minutes > 0 ? minutes : '00'}`, `${endHour}h${endMinute > 0 ? endMinute : '00'}`)
                console.log(timeSlots);

                const price = sportDetail.price / 2;
                const pricePeakHour = sportDetail.peakHourPrices / 2;

                let totalAmount = 0;

                for (const time of timeSlots) {
                    if (isTimeWithinRange(peakHourStart, peakHourEnd, time)) {
                        totalAmount += pricePeakHour;
                    } else {
                        totalAmount += price;
                    }
                }
                setPrice(totalAmount);
                setTotalAmount(totalAmount);
            }
        }
    }

    const handleSave = async () => {
        const phoneRegex = /^0\d{9}$/;

        if (!fullName) {
            toast.error("Vui lòng nhập họ và tên!");
            return;
        } else if (phoneNumber.length !== 0 && !phoneRegex.test(phoneNumber)) {
            toast.error("Số điện thoại phải là 10 số và bắt đầu từ 0!!");
            return;
        } else if (selectTime === "Chọn thời gian") {
            toast.error("Vui lòng chọn thời gian!");
            return;
        }

        const resUserSubscription = await fetch(`http://localhost:8080/rest/user/subscription/${localStorage.getItem("username")}`);
        if (!resUserSubscription.ok) {
            throw new Error('Error fetching data');
        }

        const userSubscription = await resUserSubscription.json() as UserSubscription;

        const resCountBooking = await fetch(`http://localhost:8080/rest/count/booking/${owner?.ownerId}`);
        if (!resCountBooking.ok) {
            throw new Error('Error fetching data');
        }

        const countBooking = await resCountBooking.json();

        if (countBooking >= userSubscription.accountPackage.limitBookings) {
            toast.success("Bạn đã quá số lần đặt sân cho gói miễn phí!"); return
        }

        const responseUser = await fetch(`http://localhost:8080/rest/user/sportoffline`);
        if (!responseUser.ok) {
            throw new Error('Error fetching data');
        }
        const dataUser = await responseUser.json() as User;
        createBooking(6, dataUser);

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

        setWeekDays(days); // Cập nhật state với các ngày trong tuần
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setSportFieldDuplicate({});
        setWeekDays({});
        setSelectedWeek([]);
        const getTime = startTime.match(/(\d+)h(\d+)/);
        const startHours = getTime ? Number(getTime[1]) : 0;
        const startMinutes = getTime ? Number(getTime[2]) : 0;

        const timeParts = selectTimeOnStage.split(' ');
        const getHour = timeParts[0] == '30' ? 0 : Number(timeParts[0]);
        const getMinute = Number(timeParts[2]) | 0;
        const numberOfSlots = (getHour * 60 + getMinute);

        const timeSlots: string[] = [];

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
            setEndTime(timeSlots[timeSlots.length - 1]);
            setDataTime(['1 giờ', '1 giờ 30 phút', '2 giờ', '2 giờ 30 phút', '3 giờ']);
            timeSlots.pop();
            setDataTimeOnStage(timeSlots);
        };
        if (startDate && endDate && selectTimeOnStage != 'Chọn thời gian') {
            renderWeekDay();
        }
    }, [startDate, endDate, selectTimeOnStage])

    type WeekBookingDetail = {
        [week: string]: BookingDetail[];
    }

    // type NotificationStatusSport = {
    //     [week: string]: string[];
    // };

    const [selectedWeek, setSelectedWeek] = useState<string[]>([]);
    const [sportFieldDuplicate, setSportFieldDuplicate] = useState<WeekBookingDetail>({});
    // const [checkSportFieldDuplicate, setCheckSportFieldDuplicate] = useState<NotificationStatusSport>({});

    useEffect(() => {
        let index = 0;
        for (const week of selectedWeek) {
            const dateWeek = weekDays[week];
            for (const [, bookings] of Object.entries(dateWeek)) {
                bookings.map(() => {
                    index = index + 1;

                })
            }
        }
        if (price) {
            setTotalAmount(price * index);
        }
    }, [selectedWeek, weekDays, price])

    const getWeekDate = async (weekDate: string) => {
        const dateWeek = weekDays[weekDate];
        if (!selectedWeek.includes(weekDate) && sportDetail) {
            for (const [weekIndex, bookings] of Object.entries(dateWeek)) {
                for (const booking of bookings) {
                    try {
                        // for (const s of sportDetail.statusSportFieldDetails) {
                        //     if (isDateInRange(booking.date, s.startDate, s.endDate) && s.statusName !== "Hoạt động") {
                        //         // const weekDate = booking.date; // Có thể thay thế bằng cách lấy tuần từ ngày, ví dụ: const weekDate = getWeek(booking.date);
                        //         setCheckSportFieldDuplicate(prevState => ({
                        //             ...prevState,
                        //             [weekDate]: prevState[weekDate]
                        //                 ? prevState[weekDate].some(existingItem => existingItem === `Sân ngày ${booking.date} đã ${s.statusName.toLowerCase()} vào khoảng ${s.startDate} đến ${s.endDate}`)
                        //                     ? prevState[weekDate]
                        //                     : [...prevState[weekDate], `Sân ngày ${booking.date} đã ${s.statusName.toLowerCase()} vào khoảng ${s.startDate} đến ${s.endDate}`]
                        //                 : [`Sân ngày ${booking.date} đã ${s.statusName.toLowerCase()} vào khoảng ${s.startDate} đến ${s.endDate}`],
                        //         }));

                        //         // toast.success(s.statusName + s.endDate)
                        //     }
                        // }

                        const response = await fetch(
                            `http://localhost:8080/rest/user/booking/detail/getbyday/${sportDetail?.sportFielDetailId}/${booking.date}`
                        );

                        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText} ${weekIndex} `);
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

            // setCheckSportFieldDuplicate(prev => {
            //     const newState = { ...prev };
            //     if (prev[weekDate]) {
            //         delete newState[weekDate];
            //         return newState;
            //     }
            //     return prev;
            // })
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
        // const paymentMethod = dataPaymentMethod?.find(method => method.paymentMethodId === paymentMethodId);

        // if (isOffline) {
        if (!fullName) {
            toast.error("Vui lòng nhập họ và tên!");
            return;
        } else if (!phoneNumber) {
            toast.error("Vui lòng nhập số điện thoại!");
            return;
        }
        // else if (!paymentMethod) {
        //     toast.error("Phương thức thanh toán không hợp lệ!");
        //     return;
        // }
        // } else {
        //     if (!username) {
        //         toast.error("Vui lòng nhập tên đăng nhập!");
        //         return;
        //     } else if (!paymentMethod) {
        //         toast.error("Phương thức thanh toán không hợp lệ!");
        //         return;
        //     }
        // }

        const resUserSubscription = await fetch(`http://localhost:8080/rest/user/subscription/${localStorage.getItem("username")}`);
        if (!resUserSubscription.ok) {
            throw new Error('Error fetching data');
        }

        const userSubscription = await resUserSubscription.json() as UserSubscription;

        const resCountBooking = await fetch(`http://localhost:8080/rest/count/booking/${owner?.ownerId}`);
        if (!resCountBooking.ok) {
            throw new Error('Error fetching data');
        }

        const countBooking = await resCountBooking.json();

        // toast.success(userSubscription.accountPackage.limitBookings + 'countBooking' + countBooking);

        if (countBooking >= userSubscription.accountPackage.limitBookings) {
            toast.success("Bạn đã quá số lần đặt sân cho gói miễn phí!"); return
        }

        // if (isOffline) {
        const responseUser = await fetch(`http://localhost:8080/rest/user/sportoffline`);
        if (!responseUser.ok) {
            throw new Error('Error fetching data');
        }
        const dataUser = await responseUser.json() as User;
        createBookingByPeriod(6, dataUser);
        // } else {
        //     const responseUser = await fetch(`http://localhost:8080/rest/user/${username}`);
        //     if (!responseUser.ok) {
        //         toast.error('Tên người dùng không tồn tại!');
        //         return;
        //     }
        //     const dataUser = await responseUser.json() as User;
        //     createBookingByPeriod(paymentMethod, dataUser);
        // }

        setCheckDataStatus(!checkDataStatus);
        handleClose();
    }

    const createBooking = async (paymentMethod: number, dataUser: User) => {
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
                fullName: fullName,
                //  isOffline ? fullName : dataUser.fullname,
                phoneNumber: phoneNumber,
                // isOffline ? phoneNumber : dataUser.phoneNumberUsers.find(item => item.active)?.phoneNumber.phoneNumber,
                totalAmount,
                percentDeposit: sportDetail.percentDeposit,
                paymentMethodId: paymentMethod,
                ownerId: owner.ownerId,
                status: checkPrepayPrice ? "Chờ thanh toán" : "Đã thanh toán",
                voucher: null,
                checkOwner: "owner"
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
                sportFieldDetailId: sportDetail.sportFielDetailId,
                price,
                date: dayStartBooking,
                booking: resBooking.bookingId,
                subscriptionKey: activeTab !== 'all' ? 'createKey' : null
            })
        });

        toast.success("Đặt sân thành công!");
    }

    const createBookingByPeriod = async (paymentMethod: number, dataUser: User) => {
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
                fullName: fullName,
                phoneNumber: phoneNumber,
                totalAmount,
                percentDeposit: sportDetail.percentDeposit,
                paymentMethodId: paymentMethod,
                ownerId: owner.ownerId,
                status: checkPrepayPrice ? "Chờ thanh toán" : "Đã thanh toán",
                voucher: null,
                checkOwner: "owner"
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
                            subscriptionKey: activeTab !== 'all' ? `keybooking${resBooking.bookingId}` : "",
                            weekIndex
                        })
                    });
                })
            }
        }
        toast.success("Đặt sân thành công!");
    }

    const handleClose = () => {
        setShowBookingModal(false);
        setTotalAmount(0);
        setPrice(0);
        setWeekDays({});
        setSelectedWeek([]);
        setActiveTab("all");
        setSportFieldDuplicate({});
        // setCheckSportFieldDuplicate({});
        setSelectTime("Chọn thời gian");
        setFullName("");
        setPhoneNumber("");
        setSelectTimeOnStage("Chọn thời gian")
    }

    useEffect(() => {
        setTotalAmount(0);
        setPrice(0);
        setWeekDays({});
        setSelectedWeek([]);
        setSportFieldDuplicate({});
        setSelectTime("Chọn thời gian");
        setFullName("");
        setPhoneNumber("");
    }, [activeTab])

    const renderInputBooking = () => {
        return (
            <>
                <FloatingLabel controlId="floatingUsername" label="Họ và tên!" className="flex-grow-1 mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Vui lòng nhập tên đăng nhập!"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingPhoneNumber" label="Số điện thoại!" className="flex-grow-1 mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Vui lòng nhập số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </FloatingLabel>
            </>
        )
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckPrepayPrice(event.target.value === 'prepay');
    };

    const calculateBookingPrice = (sportDetail: SportFieldDetail, startTime: string, endTime: string | undefined) => {
        const { peakHour, peakHourPrices, price } = sportDetail;

        const [peakStart, peakEnd] = peakHour.split('-');
        const [peakStartHour, peakStartMin] = peakStart.split('h').map(Number);
        const [peakEndHour, peakEndMin] = peakEnd.split('h').map(Number);

        const [timeStartHour, timeStartMin] = startTime.split('h').map(Number);

        if (!endTime) return price;
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
                    <li><span className="fw-bold">Giá đặt sân / 1h:</span> {sportDetail && sportDetail.price.toLocaleString()} đ.</li>
                    <li><span className="fw-bold">Giá đặt sân giờ vàng / 1h:</span> {sportDetail && sportDetail.peakHourPrices.toLocaleString()} đ.</li>
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
            case 'all':
                const priceForSelectedTime = sportDetail ? calculateBookingPrice(sportDetail, startTime, endTime) : null;
                return (
                    <>
                        <Row>
                            <Col>
                                {renderSportFieldInfor()}
                            </Col>
                            <Col>
                                <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</h6>
                                {renderInputBooking()}
                                <FloatingLabel controlId="floatingSelectTime" label="Chọn thời gian" className="mb-2">
                                    <Form.Select className="border border-dark"
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
                            </Col>
                        </Row>
                        <h6 className="text-uppercase text-danger fw-bold text-center my-2">Thông tin đặt sân</h6>
                        <div className="d-flex align-items-center justify-content-center mt-2">
                            <div className="form-check me-5">
                                <input
                                    value="prepay"
                                    checked={checkPrepayPrice}
                                    onChange={handleRadioChange}
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault1"
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Trả trước {sportDetail?.percentDeposit}%
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    value="full"
                                    checked={!checkPrepayPrice}
                                    onChange={handleRadioChange}
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault2"
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Trả 100%
                                </label>
                            </div>
                        </div>
                        <Row>
                            <div className="d-flex justify-content-between">
                                <span className="mx-5 mx-auto"><b> Ngày đặt: </b>{new Date(dayStartBooking).toLocaleDateString()}. </span><br />

                                <span className="mx-5 mx-auto"><b> Thời gian đá: </b>{startTime} - {endTime ? endTime : '???'}</span><br />
                            </div>
                            <div className="d-flex justify-content-around">
                                <span className="mx-auto"><b>Đơn giá: </b> <em className="text-danger">{endTime ? `${priceForSelectedTime?.toLocaleString()} đ` : 'Vui lòng chọn thời gian đá'}</em>. </span><br />
                                <span className="mx-auto"><b>Trả trước: </b> <em className="text-danger">{sportDetail && price ? (price * (sportDetail.percentDeposit / 100)).toLocaleString("vi-VN", { style: "currency", currency: "VND", }) : '???'}</em>. </span>
                                <span className="mx-auto"><b>Tổng tiền: </b><em className="text-danger">{price ? `${price?.toLocaleString()} đ` : 'Vui lòng chọn thời gian đá'}</em>. </span><br />
                            </div>
                        </Row>
                    </>
                );
            case 'deposit':
                return (
                    <>
                        <Row>
                            <Col>
                                {renderSportFieldInfor()}
                            </Col>
                            <Col>
                                <h6 className="text-uppercase text-danger fw-bold text-center">Thông tin người đặt</h6>
                                {renderInputBooking()}
                            </Col>
                        </Row>
                        <h6 className="text-uppercase text-danger fw-bold text-center my-2">Thời gian</h6>
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
                                    minDate={startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 13)) : undefined}
                                    maxDate={startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 30)) : undefined}
                                    placeholderText="Đến ngày"
                                    className="form-control end"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </InputGroup>
                            <InputGroup className="search-date mb-2">
                                <Form.Control
                                    value={startTime}
                                    placeholder="Thời gian bắt đầu"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                                <Form.Select style={{ border: '1px solid' }} value={selectTimeOnStage} className="me-3"
                                    onChange={(e) => setSelectTimeOnStage(e.target.value)} aria-label="Default select example">
                                    <option value="Chọn thời gian">Chọn thời gian</option>
                                    {dataTime && dataTime.map((time, index) => (
                                        <option key={index} value={String(time)}>{time}</option>
                                    ))}
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
                                    {Object.entries(weeks).map(([index, details]) => (
                                        <div key={index}>
                                            {details.map((detail, i) => (
                                                <span key={i}>{formatDateNotime(new Date(detail.date))}</span>
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
                                        Ngày: {formatDateNotime(new Date(booking.date))}  Giờ: {booking.startTime} - {booking.endTime}  {/* Có thể hiển thị thêm thông tin khác ở đây */}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="d-flex align-items-center justify-content-center mt-2">
                            <div className="form-check me-5">
                                <input
                                    value="prepay"
                                    checked={checkPrepayPrice}
                                    onChange={handleRadioChange}
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault1"
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Trả trước {sportDetail?.percentDeposit}%
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    value="full"
                                    checked={!checkPrepayPrice}
                                    onChange={handleRadioChange}
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault2"
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Trả 100%
                                </label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-around mt-2">
                            <span><b> Thời gian đá: </b>{startTime} - {endTime ? endTime : '???'}</span>
                            <span><b>Đơn giá: </b> <em className="text-danger">{sportDetail?.price.toLocaleString("vi-VN", { style: "currency", currency: "VND", })}</em>. </span>
                            <span><b>Trả trước: </b> <em className="text-danger">{sportDetail && totalAmount ? (totalAmount * (sportDetail.percentDeposit / 100)).toLocaleString("vi-VN", { style: "currency", currency: "VND", }) : '???'}</em>. </span>
                            <span><b>Tổng tiền: </b><em className="text-danger">{totalAmount ? totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND", }) : '???'}</em>. </span>
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
                            disabled={Object.keys(sportFieldDuplicate).length === 0
                                // && selectedWeek.length !== 0 && Object.keys(checkSportFieldDuplicate).length === 0 && selectedWeek.length !== 0
                                ? false : true
                            }
                            onClick={() => handleSaveByPeriod()}>Xác nhận</Button>
                    }
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default BookingModal;