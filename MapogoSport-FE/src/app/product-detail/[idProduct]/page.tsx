'use client';

import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
// import '../globals.css';
import Image from 'next/image';
import Modal from 'react-bootstrap/Modal';
import Collapse from 'react-bootstrap/Collapse';
import HomeLayout from '@/components/HomeLayout';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from "react-toastify";
import { formatPrice } from '@/components/Utils/Format'
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



const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    const [modalShow, setModalShow] = useState(false);
    const [selectedProductDetailSizeId, setSelectedProductDetailSizeId] = useState(null);
    const [color, setColor] = useState([]);
    const [size, setSizeByColor] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [imageGallery, setImageGallery] = useState([]);
    const [idSize, setIdSize] = useState(null);
    const [price, setPrice] = useState([]);
    const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);
    const { idProduct } = useParams();
    const [visibleCount, setVisibleCount] = useState(5);
    const [user, setUser] = useState(null); // Trạng thái cho thông tin người dùng
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Kiểm tra nếu đang chạy trên client-side
            const userSession = sessionStorage.getItem('user');
            setUser(userSession ? JSON.parse(userSession) : null);

        }
    }, []);

    const loadMoreReviews = () => {
        setVisibleCount(visibleCount + 5); // Tăng số bình luận hiển thị thêm 5
    };
    // Example options
    const handleClickBtn = () => {
        setOpen(true);
    }
    const [findByIdProduct, setFindByIdProduct] = useState<Product[]>([])


    // FindByIdProduct
    useEffect(() => {
        if (idProduct) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/rest/products/${idProduct}`)
                    const data = await response.json();
                    setFindByIdProduct(data)
                    console.log("data cuat hht ", data)
                } catch (error) {
                    console.log('Loi data', error)
                }
            }
            fetchData()
        }

    }, [idProduct])

    // product_review
    const [data, setData] = useState<Review[]>([]); // Khai báo kiểu dữ liệu cho data

    // Hàm fetchData để lấy dữ liệu đánh giá
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/rest/${idProduct}`); // API route
            setData(response.data); // Lưu đánh giá vào trạng thái
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData(); // Gọi hàm fetchData khi component mount
    }, []);

    const MyVerticallyCenteredModal = (props) => {
        const [rating, setRating] = useState(0); // Trạng thái cho rating
        const [comment, setComment] = useState(''); // Trạng thái cho bình luận

        const handleRatingSubmit = async () => {

            if (!user || !user.username) {
                toast.warning("Bạn chưa đăng nhập !")
                return;
            }
            if (comment.length < 15) {
                toast.warning("Cần phải nhập ít nhất 15 ký tự")
                return;
            }
            const ratingData = {
                user: {
                    username: user.username,
                    fullname: user.fullname
                },
                product: {
                    productId: idProduct
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
                setData(data => [...data, result]);
                console.log("Đánh giá đã được gửi thành công", result);
                props.onHide(); // Đóng modal sau khi gửi thành công
                toast.success("Gửi đánh giá thành công !")
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

    // Fetch colors based on product ID
    useEffect(() => {
        if (idProduct) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/rest/product-detail/color/${idProduct}`);
                    const data = await response.json();
                    setColor(data);
                    if (data.length > 0) {
                        // Đặt màu đầu tiên và ID chi tiết sản phẩm làm mặc định
                        setSelectedColor(data[0][0]);
                        setSelectedProductDetailId(data[0][1]);  // Giả sử phần tử thứ hai là ID chi tiết sản phẩm
                    }
                } catch (error) {
                    console.error('Error fetching colors:', error);
                }
            };
            fetchData();
        }
    }, [idProduct]);



    // Select Size by color to product detail
    useEffect(() => {
        if (selectedProductDetailId) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/rest/product-detail/size/${selectedProductDetailId}`);
                    const data = await response.json();
                    setSizeByColor(data);
                    console.log("màu", data);
                    if (data.length > 0) {
                        // Đặt kích thước mặc định đầu tiên
                        setSelectedSize(data[0].size.sizeName);
                        setSelectedProductDetailSizeId(data[0].productDetailSizeId); // Sử dụng ID từ dữ liệu trả về
                    }
                } catch (error) {
                    console.log("error size", error);
                }
            }
            fetchData();
        }
    }, [selectedProductDetailId]);
    // select price by size and productDetailId

    useEffect(() => {
        console.log("idSize", idSize)
        if (selectedProductDetailId && idSize) {
            // console.log("idSize: ", idSize)
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/rest/product-detail/price-by-size/${selectedProductDetailId}/${idSize}`)
                    const data = await response.json()
                    setPrice(data)
                    console.log("data price", data)
                    console.log("price")
                } catch (error) {
                    console.log("error price by size", error)
                }
            }
            fetchData()
        }
    }, [selectedProductDetailId, idSize])

    //Select image and gallery by idProductDetail
    useEffect(() => {
        if (selectedProductDetailId) {
            console.log("Selected Product Detail ID:", selectedProductDetailId);
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/rest/product-detail/image/gallery/${selectedProductDetailId}`)
                    const data = await response.json()
                    setImageGallery(data)
                    console.log("image,Gallery", data)
                } catch (error) {
                    console.log("error image, gallery", error)
                }
            }
            fetchData()
        }
    }, [selectedProductDetailId])

    // cập nhật màu và trạng thái
    const handleColorSelect = (colorItem) => {
        setSelectedColor(colorItem[0]); // Đặt màu đã chọn
        setSelectedProductDetailId(colorItem[1]); // Đặt ID chi tiết sản phẩm
    };

    //add to cart
    const handleAddToCart = () => {
        if (user && user.username) {
            console.log(">> user: ", user.username);
            console.log(">> productDetailSize: ", selectedProductDetailSizeId);
            console.log(">> quantity: ", quantity);

        } else {
            console.log("Người dùng chưa đăng nhập");
        }
    };

    return (
        <>
            <HomeLayout>
                <Container className="mt-5 py-3 container1 bg-light" >
                    <Row className='p-5'>
                        <Col className='ms-5' style={{ maxWidth: '550px' }}>
                            {imageGallery.length > 0 ? (
                                <>
                                    <img
                                        src={`/images/images_product/${imageGallery[0][0].image}`}
                                        className='w-75'
                                        alt="Main product"
                                        id="main-product-image"
                                        title={imageGallery[0][0].image}
                                        style={{ width: '300px', height: '300px', objectFit: 'contain' }}
                                    />

                                    {/* <div>
                                        <p>Current image: {imageGallery[0][0].image}</p>
                                    </div> */}
                                    <div className="d-flex mt-3">
                                        {imageGallery[0][0].galleries.map((galleryItem, index) => (
                                            <img
                                                key={index}
                                                src={`/images/${galleryItem.name}`}
                                                className='me-2'
                                                alt={`Gallery image ${index + 1}`}
                                                style={{ width: '100px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    document.getElementById('main-product-image').src = `/images/${galleryItem.name}`;
                                                    console.log(`Selected image: ${galleryItem.name}`);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p>No images available</p>
                            )}
                        </Col>


                        {/* Thông tin sản phẩm */}
                        <Col className='ms-5' style={{ marginLeft: '100px' }}>
                            <h4 className='mb-4'>{findByIdProduct.name}</h4>

                            <div>
                                <span className='fs-4'>Màu:</span>
                                {color.map((colorItem, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            className="ms-2 mb-4"
                                            variant={selectedColor === colorItem[0] ? "primary" : "secondary"}
                                            style={{
                                                backgroundColor: colorItem[0],
                                                color: 'white',
                                                borderRadius: '5px',
                                                padding: '5px 10px',
                                                opacity: selectedColor === colorItem[0] ? 1 : 0.7
                                            }}
                                            onClick={() => handleColorSelect(colorItem)}
                                        >
                                            {colorItem[0]}
                                        </Button>
                                    );
                                })}
                            </div>
                            <div className='d-flex'>
                                <span className='fs-4'>Size:</span>
                                {size.map((item) => {
                                    return (
                                        <div key={item.size.sizeId}>
                                            <Button
                                                className={`ms-2 mb-4 ${selectedSize === item.size.sizeName ? 'text-white' : ''}`}
                                                variant="outline-secondary"
                                                style={{
                                                    borderRadius: '5px',
                                                    padding: '5px 10px',
                                                    backgroundColor: selectedSize === item.size.sizeName ? 'gray' : ''
                                                }}
                                                onClick={() => {
                                                    setSelectedSize(item.size.sizeName);
                                                    setSelectedProductDetailSizeId(item.productDetailSizeId);
                                                }}>
                                                {item.size.sizeName}
                                            </Button>
                                        </div>
                                    );
                                })}

                            </div>


                            <h5 className='mb-3'>
                                Giá sản phẩm: {selectedSize ? price : findByIdProduct.price}
                            </h5>



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
                                <Button variant="danger" onClick={() => handleAddToCart()}>Thêm vào giỏ hàng</Button>
                            </div>
                        </Col>
                    </Row>

                </Container>

                {/*=================    */}
                <Container className="p-3 mt-4 mb-4">
                    <Row>
                        <Collapse in={open}>
                            <Col className="m-auto" >
                                <p>{findByIdProduct.description}</p>
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

                <Container className="p-3 container">
                    <Row className="mt-2 text-center">
                        <Col>
                            <p>Bạn đánh giá sao về sản phẩm này?</p>
                            <Button variant="danger" onClick={() => setModalShow(true)}>
                                Đánh giá ngay
                            </Button>
                        </Col>
                    </Row>
                    <br /><br />
                    <MyVerticallyCenteredModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                    <h5 className='ms-3'>Bình luận</h5>
                    {data
                        .sort((a, b) => new Date(b.datedAt) - new Date(a.datedAt)) // Sắp xếp theo ngày từ mới đến cũ
                        .slice(0, visibleCount) // Hiển thị số bình luận theo visibleCount
                        .map((review) => (
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
                                    <span>{new Date(review.datedAt).toLocaleString('vi-VN')}</span>

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
                    {visibleCount < data.length && ( // Kiểm tra nếu còn bình luận để tải thêm
                        <Row className="mt-4 text-center">
                            <Col>
                                <Button variant="primary" onClick={loadMoreReviews}>
                                    Tải thêm bình luận
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Container>
            </HomeLayout>
        </>
    );
};

export default ProductDetail;
