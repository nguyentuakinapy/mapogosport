import { useEffect, useState } from "react";
import { Modal, Image, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface ReviewProps {
    showReviewModal: boolean;
    setShowReviewModal: (v: boolean) => void;
    fieldId: number;
}

const ModalReviewSportField = (props: ReviewProps) => {
    const { showReviewModal, setShowReviewModal, fieldId } = props;

    const StarRating = ({ setRating }: { setRating: any }) => {
        const [rating, localSetRating] = useState(0); // Trạng thái cho rating hiện tại
        const [hover, setHover] = useState(0); // Trạng thái cho sao đang được hover

        const handleClick = (starValue: any) => {
            localSetRating(starValue); // Cập nhật trạng thái nội bộ cho rating
            setRating(starValue); // Gọi hàm từ props để cập nhật rating ở component cha
        };

        return (
            <div className="d-flex justify-content-between my-3" style={{ paddingLeft: '100px', paddingRight: '100px' }}>
                {['', '', '', '', ''].map((label, index) => {
                    const starValue = index + 1; // Tính giá trị sao
                    return (
                        <div
                            key={index}
                            className="text-center"
                            onMouseEnter={() => setHover(starValue)} // Khi di chuột qua
                            onMouseLeave={() => setHover(0)} // Khi không còn di chuột qua
                            onClick={() => handleClick(starValue)} // Gọi hàm handleClick khi nhấp
                        >
                            <i
                                className={`bi bi-star-fill fs-4`}
                                style={{ color: starValue <= (hover || rating) ? 'gold' : 'gray' }} // Thiết lập màu sắc của sao
                            ></i>
                        </div>
                    );
                })}
            </div>
        );
    };
    const [rating, setRating] = useState(0); // Trạng thái cho rating
    const [comment, setComment] = useState(''); // Trạng thái cho bình luận

    const handleRatingSubmit = () => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            fetch('http://localhost:8080/rest/fieldReview/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sportFieldId: fieldId,
                    username: parsedUserData.username,
                    rating: rating,
                    comment: comment,
                    datedAt: new Date()
                })
            }).then(res => res.json()).then(res => {
                if (res) {
                    toast.success("Gửi đánh giá thành công !");
                    handleClose();
                    mutate(`http://localhost:8080/rest/fieldReview/${fieldId}`);
                } else {
                    toast.error("Gửi đánh giá không thành công!");
                }
            });
        } else {
            toast.warning("Vui lòng đăng nhập để thực hiện chức năng này!");
        }
    };

    const handleClose = () => {
        setShowReviewModal(false);
    }

    return (
        <Modal show={showReviewModal} onHide={() => handleClose()} aria-labelledby="contained-modal-title-vcenter" size="lg"
            centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className='ms-3'>
                    Đánh giá & nhận xét
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Image src="/img/cps-ant.webp" alt="Hình ảnh thu nhỏ"
                    width={100} height={100} className="rounded-circle" />
                <span className='fs-4'>Hãy gửi đánh giá của bạn về chúng tôi</span>

                <div className='mt-3 ms-3'>
                    <span className='fs-5'>Đánh giá chung</span>
                </div>

                {/* Đánh giá */}
                <StarRating setRating={setRating} />
                <hr />

                <span className='fs-5 ms-3'>Bình Luận</span><br />
                <div className="mb-3 mt-3 ms-5 me-5">
                    <textarea
                        className="form-control"
                        placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 ký tự)"
                        rows={4}
                        cols={40}
                        style={{ borderRadius: '8px' }}
                        onChange={(e) => setComment(e.target.value)} // Cập nhật bình luận
                    ></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleRatingSubmit} className='m-auto btn btn-danger'>Gửi đánh giá</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalReviewSportField;