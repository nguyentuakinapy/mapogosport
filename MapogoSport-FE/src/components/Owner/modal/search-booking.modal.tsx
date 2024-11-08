import { use, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel, InputGroup, Nav } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

interface SearchBookingProps {
    showSearchBookingModal: boolean;
    setSearchShowBookingModal: (v: boolean) => void;
    dataTimeSport: string[];
}

const SearchBookingModal = (props: SearchBookingProps) => {
    const { showSearchBookingModal, setSearchShowBookingModal, dataTimeSport } = props;

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [note, setNote] = useState<string>(''); // Ghi chú


    const handleDateChange = (date: Date | null) => {
        if (date) {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const formatted = localDate.toISOString().split('T')[0];
            toast.success(formatted)
            setSelectedDate(formatted);
        } else {
            setSelectedDate(null);
        }
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value)
    };

    const handleFindField = async () => {
        // if (selectedDate && selectedTime) {
        //     const response = await fetch(`http://localhost:8080/rest/user/booking/detail/getnextweek/${selectedSportType}/${selectedDate}/${selectedDate}`);
        //     const bookingsFromAPI: BookingDetail[] = await response.json();
        //     let isBooked = false;
        //     const selectedSportDetail = sportField?.sportFielDetails.find(detail => detail.sportFielDetailId === selectedSportType);
        //     if (selectedSportDetail && selectedSportDetail.status === "Tạm đóng") {
        //         toast.warning("Không tìm thấy sân phù hợp theo nhu cầu!");
        //         return;
        //     }
        //     const currentDateTime = new Date();
        //     const formattedTime = selectedTime.replace('h', ':').padStart(5, '0');
        //     const selectedDateTime = new Date(`${selectedDate}T${formattedTime}`);
        //     if (selectedDateTime < currentDateTime) {
        //         toast.warning("Đã quá thời gian yêu cầu đặt sân!");
        //         return;
        //     }
        //     console.log(selectedDateTime);
        //     console.log(currentDateTime);
        //     if (Array.isArray(bookingsFromAPI) && bookingsFromAPI.length > 0) {
        //         for (const booking of bookingsFromAPI) {
        //             const { startTime, endTime, sportFieldDetail } = booking;
        //             if ((startTime <= selectedTime && endTime > selectedTime) &&
        //                 sportFieldDetail.sportFielDetailId === selectedSportType) {
        //                 isBooked = true;
        //                 break;
        //             }
        //         }
        //     }
        //     if (isBooked) {
        //         toast.warning("Đã có sân được đặt trùng với yêu cầu!");
        //     } else {
        //         toast.success("Đã tìm thấy sân theo yêu cầu!");
        //         const sportDetail = selectedSportType;
        //         const startTime = selectedTime;
        //         const dayStartBooking = selectedDate;
        //         const selectedSportDetail = sportField?.sportFielDetails.find(item => item.sportFielDetailId === Number(sportDetail));
        //         if (sportDetail && startTime && dayStartBooking) {
        //             setSportDetail(selectedSportDetail);
        //             setStartTime(startTime);
        //             setDayStartBooking(dayStartBooking);
        //             setShowBookingModal(true);
        //             setStartTimeKey(!startTimeKey);
        //         }
        //     }
        // } else {
        //     toast.warning("Vui lòng chọn ngày và giờ trước khi tìm kiếm.");
        // }
    };

    const handleClose = () => {
        setSearchShowBookingModal(false);
    }
    return (
        <>
            <Modal show={showSearchBookingModal} onHide={() => handleClose()} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-uppercase text-danger fw-bold m-auto">TÌM KIẾM SÂN</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <div className="section-form-sportField bg-white">
                        <b className="title-detail-sportField">Đặt sân theo nhu cầu</b>
                        <Form className='mt-3'>
                            <Form.Group className='mb-3'>
                                <DatePicker selected={selectedDate ? new Date(selectedDate) : null}
                                    onChange={handleDateChange} className="form-control" placeholderText="Chọn ngày đặt"
                                    dateFormat="dd/MM/yyyy" minDate={new Date()} required />
                            </Form.Group>
                            <Form.Group controlId="formTimeInput" className='mb-3'>
                                <Form.Select onChange={(e) => setSelectedTime(e.target.value)} defaultValue="" id="formTimeInput">
                                    <option value="" disabled>Chọn thời gian đặt</option>
                                    {dataTimeSport.map((time, index) => (
                                        <option key={index} value={time}>{time}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                {/* <Form.Select onChange={handleIdBySize} defaultValue="">
                                    {sportField?.sportFielDetails && [...new Set(sportField.sportFielDetails.map((detail) => detail.size))].map((size) => (
                                        <option value={size} key={size}>Sân {size}</option>
                                    ))}
                                </Form.Select> */}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel controlId="noteSportField" label="Ghi chú" style={{ zIndex: '0' }}>
                                    <Form.Control as="textarea" placeholder="Leave a comment here" style={{ height: '100px' }}
                                        maxLength={500} value={note} onChange={handleNoteChange} />
                                </FloatingLabel>
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
        </>
    )
}

export default SearchBookingModal;