'use client';

import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import '../globals.css';
import Image from 'next/image';
import Modal from 'react-bootstrap/Modal';
import Collapse from 'react-bootstrap/Collapse';
import HomeLayout from '@/components/HomeLayout';
import axios from 'axios';

const StarRating = ({ setRating }) => {
    const [rating, localSetRating] = useState(0); // Trạng thái cho rating hiện tại
    const [hover, setHover] = useState(0); // Trạng thái cho sao đang được hover

    const handleClick = (starValue) => {
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


const MyVerticallyCenteredModal = (props) => {
    const [rating, setRating] = useState(0); // Trạng thái cho rating
    const [comment, setComment] = useState(''); // Trạng thái cho bình luận
    const userSession = sessionStorage.getItem('user');
    const user = userSession ? JSON.parse(userSession) : null;

    const handleRatingSubmit = async () => {
        if (comment.length < 15) {
            alert("Bình luận cần ít nhất 15 ký tự.");
            return;
        }

        if (!user || !user.username) {
            alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        const ratingData = {
            user: { // Không dùng mảng nếu chỉ có 1 người dùng
                username: user.username
            },
            product: { // Không dùng mảng nếu chỉ có 1 sản phẩm
                productId: 2 // Bạn có thể lấy productId từ props hoặc nguồn khác
            },
            rating: rating,
            comment: comment,
            datedAt: new Date()
        };

        try {
            const response = await fetch('http://localhost:8080/rest/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingData)
            });

            if (!response.ok) {
                const errorMessage = await response.text(); // Nhận thông tin chi tiết từ lỗi
                throw new Error(`Có lỗi xảy ra khi gửi đánh giá: ${errorMessage}`);
            }

            const result = await response.json();
            console.log("Đánh giá đã được gửi thành công", result);
            props.onHide(); // Đóng modal sau khi gửi thành công
            alert("Đánh giá đã được gửi thành công!");
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
        }
    };



    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
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
                <span className='fs-4'>Vợt cầu lông siêu xịn</span>

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




const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    const [modalShow, setModalShow] = useState(false);
    // Example options
    const colors = ['Red', 'Blue', 'Green', 'Black'];
    const sizes = ['S', 'M', 'L', 'XL'];
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const handleClickBtn = () => {
        setOpen(true);
    }

    // product_review
    const [data, setData] = useState([]);
    useEffect(() => {
        // Fetch data when component is mounted
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/rest/2'); // API route or external URL
                setData(response.data); // Assuming the response contains a list of reviews
                console.log(">>> check data", response.data);
                response.data.forEach((review) => {
                    console.log("Rating:", review.rating);
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);





    return (
        <>
            <HomeLayout>
                <Container className="mt-5 py-3 container1 bg-light" >
                    <Row className='p-5'>
                        {/* Hình ảnh sản phẩm */}
                        <Col className='ms-5' style={{ maxWidth: '550px' }}>
                            <img src="/images/ck3.jpg" className='w-100 ' alt="" />
                        </Col>

                        {/* Thông tin sản phẩm */}
                        <Col className='ms-5' style={{ marginLeft: '100px' }}>
                            <h4 className='mb-4'>Tên sản phẩm: Sản phẩm tự chế</h4>
                            <div>
                                <span className='fs-4'>Màu:</span>
                                {colors.map((color) => {
                                    const isSelected = selectedColor === color;  // Kiểm tra xem màu có được chọn hay không

                                    return (
                                        <Button
                                            key={color}
                                            className={`ms-2 mb-4 ${isSelected ? 'border-3 border-dark' : ''}`}  // Thêm viền nếu màu đang được chọn
                                            variant={isSelected ? "primary" : "outline-secondary"}  // Thay đổi kiểu dựa trên trạng thái chọn
                                            style={{
                                                backgroundColor: color,
                                                color: 'white',
                                                borderRadius: '5px',
                                                padding: '5px 10px',
                                                opacity: isSelected ? 1 : 0.7  // Làm cho button đã chọn nổi bật hơn
                                            }}
                                            onClick={() => setSelectedColor(color)}  // Cập nhật trạng thái khi click vào
                                        >
                                            {color}
                                        </Button>
                                    );
                                })}
                            </div>
                            <div>
                                <span className='fs-4'>Size:</span>
                                {sizes.map((size) => {
                                    const isSelected = selectedSize === size;  // Kiểm tra xem size có được chọn hay không
                                    return (
                                        <Button key={size} className={`ms-2 mb-4 ${isSelected ? 'text-white' : ''}`} variant="outline-secondary"
                                            style={{ borderRadius: '5px', padding: '5px 10px', backgroundColor: isSelected ? 'gray' : '' }}
                                            onClick={() => setSelectedSize(size)}>
                                            {size}</Button>
                                    )
                                })}
                            </div>

                            <h5 className='mb-3'>Giá sản phẩm: 100.000.000 VND</h5>


                            <div className="d-flex align-items-center mb-4">
                                <span>Số lượng</span>
                                <ButtonGroup className="ms-3">
                                    <Button variant="outline-secondary" onClick={decreaseQuantity}>-</Button>
                                    <Form.Control type="text" value={quantity} readOnly className="text-center" style={{ width: '50px' }} />
                                    <Button variant="outline-secondary" onClick={increaseQuantity}>+</Button>
                                </ButtonGroup>
                            </div>

                            {/* Nút hành động */}
                            <div className="d-flex">
                                <Button variant="danger">Thêm vào giỏ hàng</Button>
                            </div>
                        </Col>
                    </Row>

                </Container>

                {/*=================    */}
                <Container className="p-3 mt-4 mb-4">
                    <Row>

                        <h6>Giới thiệu Lưới chắn bóng 3mm</h6>
                        <Collapse in={open}>
                            <Col className="m-auto" >


                                <p>
                                    Lưới chắn bóng 3mm là một sản phẩm chất lượng cao, được thiết kế để cung cấp giải pháp bảo vệ và kiểm soát tối ưu trong các khu vực thể thao và giải trí. Với đường kính sợi 3mm, lưới này mang lại sự bền bỉ vượt trội và khả năng chịu lực tốt, làm cho nó trở thành sự lựa chọn hàng đầu cho các sân bóng đá, sân tennis và nhiều ứng dụng khác.
                                </p>
                                <p>
                                    Lưới chắn bóng 3mm được làm từ sợi polypropylene hoặc nylon chất lượng cao, giúp chống lại tác động của thời tiết, tia UV và ma sát, đảm bảo độ bền lâu dài. Đường kính sợi lớn giúp lưới có khả năng chịu lực cao, ngăn chặn hiệu quả việc bóng và các vật thể khác rơi ra ngoài khu vực chơi. Thiết kế ô lưới đều và chắc chắn, cùng với khả năng lắp đặt dễ dàng, làm cho sản phẩm này rất tiện lợi cho việc sử dụng trong các sân thể thao.
                                </p>
                                <p>
                                    Sản phẩm này không chỉ cung cấp sự bảo vệ hiệu quả mà còn dễ dàng làm sạch và bảo trì, giúp duy trì hiệu suất tối ưu và ngoại hình bền đẹp. Lưới chắn bóng 3mm là lựa chọn lý tưởng cho những ai cần một giải pháp chắn bóng đáng tin cậy và bền bỉ.
                                </p>


                                {/*nên chia db mô tả thành 2 cái là mô tả và thông tin sản phẩm vì phải tách ra mới làm dc cái thu gon 1 nữa  */}
                                <h6>Thông tin Lưới chắn bóng 3mm</h6>
                                <ul>
                                    <li>Chất Liệu: Polypropylene hoặc Nylon, tùy thuộc vào yêu cầu cụ thể và ứng dụng.</li>
                                    <li>Đường Kính Sợi: 3mm.</li>
                                    <li>Kích Thước Ô Lưới: Có thể tùy chọn, thường dao động từ 50mm x 50mm đến 100mm x 100mm, tùy thuộc vào mục đích sử dụng.</li>
                                    <li>Chiều Dài và Chiều Rộng: Có thể tùy chỉnh theo yêu cầu của khách hàng hoặc theo kích thước tiêu chuẩn như 2m x 10m, 3m x 15m, v.v.</li>
                                    <li>Độ Bền: Chịu được tác động mạnh từ bóng và các vật thể khác, chống rách và ăn mòn.</li>
                                    <li>Khả Năng Chịu Lực: Cao, đảm bảo không bị đứt gãy khi chịu lực mạnh từ bóng và các điều kiện thời tiết khắc nghiệt.</li>
                                    <li>Chống UV: Có khả năng chống chịu tốt với tia UV, giúp lưới không bị biến dạng hoặc mất màu khi tiếp xúc lâu dài với ánh sáng mặt trời.</li>
                                    <li>Màu Sắc: Có thể lựa chọn màu sắc theo yêu cầu, như xanh lá, trắng, đen, hoặc các màu sắc khác.</li>
                                </ul>

                                <h6>Đối tượng sử dụng Lưới chắn bóng 3mm</h6>
                                <ul>
                                    <li>Các Câu Lạc Bộ Thể Thao</li>
                                    <li>Sân Vận Động</li>
                                    <li>Trường Học và Đại Học</li>
                                    <li>Cơ Sở Đào Tạo Thể Thao</li>
                                    <li>Khu Vui Chơi và Giải Trí</li>
                                    <li>Nông Trại và Vườn Cây</li>
                                    <li>Các Doanh Nghiệp và Tổ Chức</li>
                                </ul>
                            </Col>
                        </Collapse>
                        <div onClick={() => setOpen(!open)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open} className="d-flex">
                            <Button onClick={() => handleClickBtn()} className='m-auto' variant="outline-secondary">
                                {open ? 'Thu gọn mô tả' : 'Xem mô tả sản phẩm'}
                            </Button>
                        </div>
                    </Row>
                </Container>
                {/*=================    */}

                <Container className="p-3 container ">

                    <Row className="mt-2 text-center">
                        <Col>
                            <p>Bạn đánh giá sao về sản phẩm này?</p>
                            <Button variant="danger" onClick={() => setModalShow(true)}>
                                Đánh giá ngay
                            </Button>
                        </Col>
                    </Row><br /><br />
                    <MyVerticallyCenteredModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                    <h5 className='ms-3'>Bình luận</h5>
                    {data.map((review) => (
                        <Row className="mt-5 ms-5" key={review.productReviewId}>
                            <Col>
                                <Image
                                    src="/img/avatar.jpg"
                                    alt="Hình ảnh thu nhỏ"
                                    width={35} // Kích thước hình ảnh thu nhỏ
                                    height={35}
                                    className="rounded-circle" // Sử dụng lớp tiện ích Bootstrap để tạo hình tròn
                                />
                                <span className='me-4'>{review.user.fullname}</span> {/* Truy cập fullname từ user */}
                                <i className="bi bi-calendar me-2"></i>
                                <span>{new Date(review.datedAt).toLocaleDateString('vi-VN')}</span> {/* Định dạng ngày */}
                                <div>
                                    {/* Hiển thị đánh giá sao dựa trên giá trị rating */}
                                    <span className="text-warning ms-5 fs-3">
                                        {'★'.repeat(review.rating)} {/* Hiển thị sao đầy */}
                                    </span>
                                    <br />
                                    <span className='ms-5'>{review.comment}</span> {/* Hiển thị bình luận đánh giá */}
                                </div>
                            </Col>
                        </Row>
                    ))}






                </Container>
            </HomeLayout>
        </>
    );
};

export default ProductDetail;
