import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import CheckoutModal from '@/components/Booking/booking.Checkout';

interface SearchBookingProps {
    showSearchBookingModal: boolean;
    setSearchShowBookingModal: (v: boolean) => void;
    dataTimeSport: string[];
    sportField?: SportField | null;
}

const SearchSportField = (props: SearchBookingProps) => {
    const { showSearchBookingModal, setSearchShowBookingModal, sportField } = props;
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSportType, setSelectedSportType] = useState<number | null>(null);
    const [sportDetail, setSportDetail] = useState<SportFieldDetail>();
    const [startTime, setStartTime] = useState("");
    const [dayStartBooking, setDayStartBooking] = useState("");
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [startTimeKey, setStartTimeKey] = useState<boolean>(true);
    const [validTimes, setValidTimes] = useState<string[]>([]);
    const [opening, setOpening] = useState<number>();
    const [operatingTime, setOperatingTime] = useState<number>(0);
    const [checkDataStatus, setCheckDataStatus] = useState<boolean>(true);

    useEffect(() => {
        if (sportField && sportField.sportFielDetails) {
            const defaultSportType = sportField.sportFielDetails[0]?.sportFielDetailId || null;
            setSelectedSportType(defaultSportType);
        }
    }, [sportField]);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const formatted = localDate.toISOString().split('T')[0];
            setSelectedDate(formatted);
        } else {
            setSelectedDate(null);
        }
    };

    const handleIdBySize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = e.target.value;
        if (sportField?.sportFielDetails) {
            const selectedDetail = sportField.sportFielDetails.find(detail => detail.size === newSize);
            setSelectedSportType(selectedDetail ? selectedDetail.sportFielDetailId : null);
        }
    };

    useEffect(() => {
        if (sportField) {
            getTime()
        };
    }, [sportField]);

    const getTime = () => {
        if (sportField) {
            const open = sportField?.opening;
            const close = sportField?.closing;
            if (open && typeof open === 'string' && close && typeof close === 'string') {
                const numberOpen = open.match(/\d+/);
                const numberClose = close.match(/\d+/);
                if (numberOpen && numberClose) {
                    setOpening(Number(numberOpen[0]));
                    setOperatingTime(Number(numberClose[0]) - Number(numberOpen[0]));
                }
            }
        }
    }

    useEffect(() => {
        const newData: string[] = [];
        for (let index = 0; index < (operatingTime * 2) + 1; index++) {
            if (newData.length === 0) {
                newData.push(String(opening + "h00"));
            } else {
                if (newData[newData.length - 1].includes("h30")) {
                    const getDataTime = newData[newData.length - 2];
                    const getTime = getDataTime.match(/\d+/);
                    if (getTime) {
                        newData.push(String(Number(getTime[0]) + 1) + "h00");
                    }

                } else {
                    const getDataTime = newData[newData.length - 1];
                    const getTime = getDataTime.match(/\d+/);
                    if (getTime) {
                        const createOpening = String(getTime[0]) + "h30";
                        newData.push(createOpening);
                    }
                }
            }
        }
        const index = newData.indexOf(sportField?.opening || 'NA');
        if (index !== -1) {
            newData.splice(0, index);
        }
        const modifiedValidTimes = newData.slice(0, -2);
        setValidTimes(modifiedValidTimes);
    }, [operatingTime, opening]);

    const handleFindField = async () => {
        if (selectedDate && selectedTime) {
            const response = await fetch(`http://localhost:8080/rest/user/booking/detail/getnextweek/${selectedSportType}/${selectedDate}/${selectedDate}`);
            const bookingsFromAPI: BookingDetail[] = await response.json();
            let isBooked = false;
            const selectedSportDetail = sportField?.sportFielDetails.find(detail => detail.sportFielDetailId === selectedSportType);

            if (selectedSportDetail && selectedSportDetail.status === "Tạm đóng") {
                toast.warning("Không tìm thấy sân phù hợp theo nhu cầu!");
                return;
            }

            const currentDateTime = new Date();
            const formattedTime = selectedTime.replace('h', ':').padStart(5, '0');
            const selectedDateTime = new Date(`${selectedDate}T${formattedTime}`);

            if (selectedDateTime < currentDateTime) {
                toast.warning("Đã quá thời gian yêu cầu đặt sân!");
                return;
            }

            if (Array.isArray(bookingsFromAPI) && bookingsFromAPI.length > 0) {
                for (const booking of bookingsFromAPI) {
                    const { startTime, endTime, sportFieldDetail } = booking;
                    if ((startTime <= selectedTime && endTime > selectedTime) &&
                        sportFieldDetail.sportFielDetailId === selectedSportType) {
                        isBooked = true;
                        break;
                    }
                }
            }

            if (isBooked) {
                toast.warning("Đã có sân được đặt trùng với yêu cầu!");
            } else {
                toast.success("Đã tìm thấy sân theo yêu cầu!");
                const selectedSportDetail = sportField?.sportFielDetails.find(item => item.sportFielDetailId === selectedSportType);
                if (selectedSportDetail) {
                    setSportDetail(selectedSportDetail);
                    setStartTime(selectedTime);
                    setDayStartBooking(selectedDate);
                    setShowBookingModal(true);
                    handleClose();
                }
            }
        } else {
            toast.warning("Vui lòng chọn ngày và giờ trước khi tìm kiếm.");
        }
    };

    const handleClose = () => {
        setSelectedDate('');
        setSearchShowBookingModal(false);
    }
    return (
        <>
            <Modal show={showSearchBookingModal} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">Đặt sân theo nhu cầu</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0 pb-0">
                    <div className="section-form-sportField bg-white">
                        <Form className='mt-2'>
                            <Form.Group className='mb-2'>
                                <DatePicker selected={selectedDate ? new Date(selectedDate) : null}
                                    onChange={handleDateChange} className="form-control" placeholderText="Chọn ngày đặt"
                                    dateFormat="dd/MM/yyyy" minDate={new Date()} required />
                            </Form.Group>
                            <Form.Group controlId="formTimeInput" className='mb-2'>
                                <Form.Select onChange={(e) => setSelectedTime(e.target.value)} defaultValue="" id="formTimeInput">
                                    <option value="" disabled>Chọn thời gian đặt</option>
                                    {validTimes.map((time, index) => (
                                        <option key={index} value={time}>{time}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Select onChange={handleIdBySize} defaultValue="">
                                    {sportField?.sportFielDetails && [...new Set(sportField.sportFielDetails.map((detail) => detail.size))].map((size) => (
                                        <option value={size} key={size}>Sân {size}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group >
                                <div className='btn btn-sportField' onClick={handleFindField}>Tìm sân</div>
                            </Form.Group>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal >
            <CheckoutModal showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal}
                sportDetail={sportDetail} startTime={startTime} dayStartBooking={dayStartBooking}
                sport={sportField} owner={sportField?.owner}
                checkDataStatus={checkDataStatus} setCheckDataStatus={setCheckDataStatus}
                startTimeKey={startTimeKey}
            />
        </>
    )
}

export default SearchSportField;