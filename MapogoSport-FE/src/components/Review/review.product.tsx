import { useData } from "@/app/context/UserContext";
import { useState } from "react";
import { Modal, Image, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface ReviewProps {
    showReviewModal: boolean;
    setShowReviewModal: (v: boolean) => void;
    idProduct: number;
    data: ProductReviewUser[];
    dataOrder: Order[]
}

interface StarRating {
    setRating: (value: number) => void;
}


const StarRating = ({ setRating }: StarRating) => {
    const [rating, localSetRating] = useState(0); // Trạng thái cho rating hiện tại
    const [hover, setHover] = useState(0); // Trạng thái cho sao đang được hover

    const handleClick = (starValue: number) => {
        localSetRating(starValue); // Cập nhật trạng thái nội bộ cho rating
        setRating(starValue); // Gọi hàm từ props để cập nhật rating ở component cha
    };


    return (
        <div className="d-flex justify-content-between my-3" style={{ paddingLeft: '100px', paddingRight: '100px' }}>
            {['', '', '', '', ''].map((_label, index) => {
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


const ModalReviewProductField = (props: ReviewProps) => {
    const { data, showReviewModal, setShowReviewModal, idProduct, dataOrder } = props;
    const user = useData();
    const [rating, setRating] = useState<number>(0); // Trạng thái cho rating
    const [comment, setComment] = useState(''); // Trạng thái cho bình luận
    const hasReviewed = data?.some((review: ProductReviewUser) => review.user.username === user?.username);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;




    const handleRatingSubmit = async () => {
        if (!user || !user.username) {
            toast.warning("Bạn chưa đăng nhập!");
            return;
        }
        if (rating <= 0) {
            toast.warning("Cần phải chọn đánh giá");
            return;
        }

        if (hasReviewed) {
            toast.warning("Bạn đã gửi đánh giá cho sân này rồi");
            return;
        }
        if (dataOrder) {
            const userIsOrder = dataOrder.some((order: Order) => order.user.username === user?.username && order.status === "Đã hoàn thành");
            if (!userIsOrder) {
                toast.warning("Bạn không thể đánh giá khi chưa đặt hàng.");
                return;
            }
        }

        if (user && user.username) {
            // Prepare the rating data as per the expected DTO structure
            const ratingData = {
                userName: user.username,
                productId: idProduct,
                rating: rating,
                comment: comment,
                datedAt: new Date()
            };

            try {
                const response = await fetch(`${BASE_URL}rest/user/productReview/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ratingData)
                });

                if (!response.ok) {
                    const errorMessage = await response.text(); // Capture detailed error message
                    throw new Error(`Có lỗi xảy ra khi gửi đánh giá: ${errorMessage}`);
                }

                mutate(`${BASE_URL}rest/user/productReview/${idProduct}`)
                console.log("Đánh giá đã được gửi thành công");
                handleClose();
                toast.success("Gửi đánh giá thành công!");
            } catch (error) {
                console.error("Lỗi khi gửi đánh giá:", error);
                toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
            }
        }

    };

    const handleClose = () => {
        setShowReviewModal(false);
    }

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
                <Modal.Title id="contained-modal-title-vcenter" className='ms-3'>
                    Đánh giá & nhận xét
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Image
                    src="/img/cps-ant.webp"
                    alt="Hình ảnh thu nhỏ"
                    width={100} // Kích thước hình ảnh thu nhỏ
                    height={100}
                    className="rounded-circle" // Hình tròn
                />
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
                        placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm !"
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

export default ModalReviewProductField;
