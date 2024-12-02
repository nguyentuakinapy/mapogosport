import { useState } from "react";
import { Modal, Image, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { decodeString } from "../Utils/Format";

interface ReviewProps {
    showReviewModal: boolean;
    setShowReviewModal: (v: boolean) => void;
    fieldId: number;
    dataReview: FieldReview[];
}

const ModalReviewSportField = (props: ReviewProps) => {
    const { showReviewModal, setShowReviewModal, fieldId, dataReview } = props;

    const [rating, setRating] = useState(0); // Trạng thái cho rating
    const [comment, setComment] = useState(""); // Trạng thái cho bình luận
    const username = decodeString(String(localStorage.getItem("username")));

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Kiểm tra nếu người dùng đã đánh giá
    const hasReviewed = dataReview?.some(
        (review: FieldReview) => review.user.username === username
    );

    const handleClose = () => {
        setShowReviewModal(false);
        setComment("");
        setRating(0);
    };

    const handleRatingSubmit = async () => {
        if (hasReviewed) {
            toast.warning("Bạn đã gửi đánh giá cho sân này rồi.");
            return;
        }
        if (!username) {
            toast.warning("Vui lòng đăng nhập để thực hiện chức năng này!");
            return;
        }
        if (rating === 0 || comment.trim().length < 15) {
            toast.warning("Vui lòng nhập đánh giá và bình luận (ít nhất 15 ký tự).");
            return;
        }

        try {
            const response = await fetch(
                `${BASE_URL}rest/fieldReview/save`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sportFieldId: fieldId,
                        username: username,
                        rating: rating,
                        comment: comment,
                        datedAt: new Date(),
                    }),
                }
            );

            if (response.ok) {
                toast.success("Gửi đánh giá thành công!");
                handleClose();
                mutate(`${BASE_URL}rest/fieldReview/${fieldId}`);
            } else {
                toast.error("Gửi đánh giá không thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            toast.error("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.");
        }
    };

    const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
        const [hover, setHover] = useState(0);

        const handleClick = (starValue: number) => {
            setRating(starValue); // Không cho chỉnh sửa nếu đã đánh giá
        };

        return (
            <div
                className="d-flex justify-content-between my-3"
                style={{ paddingLeft: "100px", paddingRight: "100px" }}
            >
                {["", "", "", "", ""].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <div
                            key={index}
                            className="text-center"
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => handleClick(starValue)}
                        >
                            <i
                                className={`bi bi-star-fill fs-4`}
                                style={{
                                    color: starValue <= (hover || rating) ? "gold" : "gray",
                                }}
                            ></i>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Modal
            show={showReviewModal}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            size="lg"
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className="ms-3">
                    Đánh giá & nhận xét
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Image
                    src="/img/cps-ant.webp"
                    alt="Hình ảnh thu nhỏ"
                    width={100}
                    height={100}
                    className="rounded-circle"
                />
                <span className="fs-4">Hãy gửi đánh giá của bạn về chúng tôi</span>

                <div className="mt-3 ms-3">
                    <span className="fs-5">Đánh giá chung</span>
                </div>

                {/* Đánh giá */}
                <StarRating rating={rating} setRating={setRating} />

                <hr />

                <span className="fs-5 ms-3">Bình Luận</span>
                <br />
                <div className="mb-3 mt-3 ms-5 me-5">
                    <textarea
                        className="form-control"
                        placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 ký tự)"
                        rows={4}
                        cols={40}
                        style={{ borderRadius: "8px" }}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}

                    ></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={handleRatingSubmit}
                    className="m-auto btn btn-danger"
                >
                    {hasReviewed ? "Bạn đã đánh giá" : "Gửi đánh giá"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalReviewSportField;
