'use client';
import { Container, Row, Col, Button, ButtonGroup, Form, OverlayTrigger, Tooltip, Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import HomeLayout from '@/components/HomeLayout';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from "react-toastify";
import useSWR, { mutate } from 'swr';
import ModalReviewProductField from '@/components/Review/review.product';
import Loading from '@/components/loading';
import { decodeJson, decodeString } from '@/components/Utils/Format';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ProductDetail = () => {
    const [quantity, setQuantity] = useState<number>(1);
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState<User>();

    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectedSize, setSelectedSize] = useState<number>();
    const [idSize, setIdSize] = useState<number>();
    const [price, setPrice] = useState<number>();
    const { idProduct } = useParams();
    const [visibleCount, setVisibleCount] = useState(5);
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const userSession = sessionStorage.getItem('user');
        if (userSession) {
            setUserData(JSON.parse(decodeJson(userSession)) as User);
        }
    }, [])

    useEffect(() => {
        const socket = new SockJS(`${BASE_URL}ws`); // Địa chỉ endpoint WebSocket
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/login', (message) => {
                const userSession = sessionStorage.getItem('user');
                if (userSession && message.body == decodeString(String(localStorage.getItem('username')))) {
                    setUserData(JSON.parse(decodeJson(userSession)) as User);
                }
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    const [selectedSizeQuantity, setSelectedSizeQuantity] = useState<number>(0);
    const increaseQuantity = () => {
        if (quantity >= 10) {
            toast.info("Số lượng vượt quá giới hạn.");
            return;
        }
        if (quantity < selectedSizeQuantity) {
            setQuantity(quantity + 1);
        } else {
            toast.info("Số lượng vượt quá giới hạn.");
        }


    };

    const loadMoreReviews = () => {
        setVisibleCount(visibleCount + 5); // Tăng số bình luận hiển thị thêm 5
    };
    const hideReviews = () => {

        setVisibleCount(visibleCount - 5);
    }

    // Example options
    const handleClickBtn = () => {
        setOpen(true);
    }
    const { data: findByIdProduct } = useSWR<Product>(
        `${BASE_URL}rest/products/${idProduct}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const { data: imageGallery } = useSWR<ProductDetailAndDetailSize[]>(
        `${BASE_URL}rest/product-detail/image/gallery/${idProduct}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    // FindByIdProduct
    useEffect(() => {
        if (imageGallery) {
            setSelectedSize(imageGallery[0].detailSizes.length > 0 ? imageGallery[0].detailSizes[0].detailSizeId : 0);
            setSelectedSizeQuantity(imageGallery[0].detailSizes.length > 0 ? imageGallery[0].detailSizes[0].quantity : 0);
            setPrice(imageGallery[0].detailSizes.length > 0 ? imageGallery[0].detailSizes[0].price : 0);
            setIdSize(imageGallery[0].productDetailId)
        }
    }, [imageGallery])

    const { data } = useSWR(`${BASE_URL}rest/user/productReview/${idProduct}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });
    const { data: dataOrder } = useSWR(`${BASE_URL}rest/admin/findAll-order/${idProduct}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const { data: dataCart } = useSWR(userData && `${BASE_URL}rest/cart/${userData.username}`, fetcher);

    const handleAddToCart = async () => {
        if (!userData) {
            toast.success("Bạn chưa đăng nhập!")
            return
        }

        const existingItem = dataCart?.find(
            (item: Cart) => item.productDetailSize.productDetailSizeId === selectedSize
        );
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        if (currentQuantity >= 10) {
            toast.warning("Sản phẩm này đã đạt giới hạn tối đa trong giỏ hàng (10 sản phẩm).");
            return;
        }

        if (selectedSizeQuantity <= 0) {
            toast.info("Không thể thêm vào giỏ hàng vì size này đã hết. Vui lòng chọn 1 size khác")
            return;
        }
        const dataAddCart = {
            username: userData.username,
            productDetailSizeId: selectedSize,
            date: new Date(),
            totalAmount: 150.00,
            quantity: quantity
        };

        try {
            const response = await fetch(`${BASE_URL}rest/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataAddCart)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Có lỗi xảy ra khi thêm giỏ hàng: ${errorMessage}`);
            }


            toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
            mutate(`${BASE_URL}rest/cart/${userData.username}`);
            mutate(`${BASE_URL}rest/cart/count/${userData.username}`); // Tái tải dữ liệu

        } catch (error) {
            // console.error("Lỗi khi gửi yêu cầu:", error);
            alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
        }
    };

    const [filteredData, setFilteredData] = useState(null); // State to store filtered reviews

    const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null); // `null` để hiển thị tất cả mặc định

    const handleClick = (value: number | null) => {
        if (selectedRatingFilter === value) {
            // Nếu đã chọn số sao này rồi, nhấn lại sẽ xóa bộ lọc
            setSelectedRatingFilter(null);
            setFilteredData(data); // Hiển thị lại tất cả bình luận
            return;
        }

        // Nếu chọn số sao mới
        setSelectedRatingFilter(value);

        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}rest/user/productReview/find-review-by-rating/${idProduct}/${value}`);
                if (response.data) {
                    setFilteredData(response.data); // Cập nhật bình luận theo số sao
                } else {
                    setFilteredData(null); // Không có bình luận nào
                }
            } catch (error) {

            }
        };

        fetchData();

    };

    const handleChatMess = () => {
        if (userData) {
            if (userData.username !== "myntd") {
                window.history.pushState({}, "", `?status=default`);
            } else {
                toast.info('Bạn không thể nhắn với chính mình ')
            }
        } else {
            toast.warning('Vui lòng đăng nhập để chat với chủ shop')
        }
    }


    const reviewCount = data?.length || 0; // Ensure data is defined and default to 0
    const averageRating = reviewCount > 0
        ? (data.reduce((total: number, review: ProductReview) => total + review.rating, 0) / reviewCount).toFixed(1)
        : "0.0"; // Calculate average rating or default to "0.0"

    return (
        <>
            <HomeLayout>
                {!imageGallery && !findByIdProduct ?
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '90vh' }}>
                        <Loading></Loading>
                    </div>
                    :

                    <div>
                        <Container className="mt-3 container1 bg-light" style={{ maxWidth: '1170px' }}>
                            <Row className='pt-3'>
                                <Col xs={6}>
                                    <Image src={`${findByIdProduct?.image}`}
                                        alt={findByIdProduct?.name} id="main-product-image"
                                        style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                                    />
                                    <div id="imageGalleryCarousel" className="carousel slide mt-3" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            {imageGallery && imageGallery.map((item, index) => {
                                                return (
                                                    <div key={item.productDetailId} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                        <div className="row justify-content-center">
                                                            {item.galleries.slice(index, index + 3).map((item, subIndex) => (
                                                                <div className="col-4 d-flex justify-content-center" key={subIndex}>
                                                                    <Image src={item.name} alt={`Gallery image ${index + subIndex + 1}`}
                                                                        style={{ width: '90px', height: '90px', objectFit: 'cover', cursor: 'pointer' }}
                                                                        onClick={() => {
                                                                            (document.getElementById('main-product-image') as HTMLImageElement).src = item.name;
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#imageGalleryCarousel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#imageGalleryCarousel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <h4>{findByIdProduct?.name}</h4>
                                    <div className='star-comment '>
                                        <div className="star d-flex">
                                            Đánh giá: {averageRating} <i className="text-warning mx-2 bi bi-star-fill"></i> ({reviewCount} Đánh giá)
                                            <div className="btn-option-icon">
                                                <i className="text-danger bi bi-heart-fill mx-2"></i>
                                                <OverlayTrigger overlay={<Tooltip>Trò chuyện</Tooltip>}>
                                                    <i onClick={handleChatMess} className="bi bi-chat-dots-fill text-primary"></i>
                                                </OverlayTrigger>
                                            </div>
                                        </div>


                                    </div>
                                    <h5 className="text-danger mt-3">
                                        {selectedSize !== 0 ?
                                            imageGallery && imageGallery.find(item => item.productDetailId === idSize)?.
                                                detailSizes.find(item => item.detailSizeId === selectedSize)?.price.toLocaleString() + " đ" : price?.toLocaleString() + " đ"
                                        }
                                    </h5>
                                    <div className="mb-3">
                                        <span className="d-block fw-bold mb-2">Màu sắc:</span>
                                        <div className="d-flex flex-wrap">
                                            {imageGallery && imageGallery.map((item, index) => {
                                                return (
                                                    <Button key={index} className="me-2 mb-2"
                                                        variant={idSize === item.productDetailId ? 'dark' : 'outline-secondary'}
                                                        onClick={() => {
                                                            setIdSize(item.productDetailId);
                                                            setSelectedSize(item.detailSizes.length > 0 ? item.detailSizes[0].detailSizeId : 0);
                                                            setSelectedSizeQuantity(item.detailSizes.length > 0 ? item.detailSizes[0].quantity : 0);
                                                            (document.getElementById('main-product-image') as HTMLImageElement).src = item.image;

                                                        }}>
                                                        <Image src={`${item.image}`} alt={item.color}
                                                            style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'cover' }}
                                                        />
                                                        {item.color}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {idSize && (
                                        <div className="mb-3">
                                            <span className="d-block fw-bold mb-2">Size:</span>
                                            <div className="d-flex flex-wrap">
                                                {imageGallery && imageGallery.find(item => item.productDetailId === idSize)?.detailSizes.map((item) => {
                                                    return (
                                                        <>
                                                            <Button
                                                                key={item.detailSizeId}
                                                                className="me-2 mb-2"
                                                                variant={selectedSize === item.detailSizeId ? 'dark' : 'outline-secondary'}
                                                                disabled={item.quantity <= 0}
                                                                onClick={() => {
                                                                    setSelectedSize(item.detailSizeId);
                                                                    setSelectedSizeQuantity(item.quantity)
                                                                }}
                                                            >
                                                                {item.size}
                                                            </Button>
                                                        </>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}


                                    <div className="mb-3">
                                        {selectedSizeQuantity <= 0 ? (
                                            <span className="text-danger">Sản phẩm này đã hết hàng</span>
                                        ) : (
                                            <span className="text-success">Còn lại: {selectedSizeQuantity} sản phẩm</span>
                                        )}
                                        <span className="d-block fw-bold mb-2 mt-2">Số lượng:</span>

                                        <ButtonGroup>
                                            <Button variant="outline-secondary" onClick={decreaseQuantity}>-</Button>
                                            <Form.Control
                                                type="text"
                                                value={quantity}
                                                readOnly
                                                className="text-center"
                                                style={{ width: '50px' }}
                                            />
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
                                        <p>{findByIdProduct?.description}</p>
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
                            <ModalReviewProductField showReviewModal={modalShow}
                                setShowReviewModal={setModalShow} idProduct={Number(idProduct)} data={data} dataOrder={dataOrder} />
                            <h5 className='ms-3'>Bình luận</h5>
                            <div className="d-flex ms-4">
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <button key={value}
                                        type="button"
                                        className='btn ms-2'
                                        style={selectedRatingFilter === value ? { background: '#142239', color: 'red' } : { background: '#142239', color: 'white' }}
                                        onClick={() => handleClick(value)}>
                                        {value} ★
                                    </button>
                                ))}
                            </div>
                            {(filteredData ? filteredData : data) && Array.isArray(filteredData ? filteredData : data) ? (
                                (filteredData || data)
                                    .sort((a: ProductReviewData, b: ProductReviewData) => new Date(b.datedAt).getTime() - new Date(a.datedAt).getTime())
                                    .slice(0, visibleCount)
                                    .map((review: ProductReviewData) => (
                                        <Row className="mt-5 ms-5" key={review.productReviewId}>
                                            <Col>
                                                <Image src="/img/avatar.jpg" alt="Hình ảnh thu nhỏ" width={35} height={35} className="rounded-circle" />
                                                <span className="me-4">{review.user.fullname}</span>
                                                <i className="bi bi-calendar me-2"></i>
                                                <span>{new Date(review.datedAt).toLocaleString('vi-VN')}</span>
                                                <div>
                                                    <span className="text-warning ms-5 fs-3">
                                                        {'★'.repeat(review.rating)}
                                                    </span>
                                                    <br />
                                                    <span className="ms-5">{review.comment}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))
                            ) : (
                                <p>Loading...</p> // Display a loading message while data is being fetched
                            )}
                            {data && visibleCount < data.length ? (
                                // Hiển thị nút "Tải thêm bình luận" nếu còn bình luận để tải thêm
                                <div className="mt-3 text-center">
                                    <Button variant="danger" onClick={loadMoreReviews}>Tải thêm bình luận</Button>
                                </div>
                            ) : (
                                // Hiển thị nút "Ẩn bớt bình luận" chỉ khi visibleCount > 5
                                visibleCount > 5 && (
                                    <div className="mt-3 text-center">
                                        <Button variant="danger" onClick={hideReviews}>Ẩn bớt bình luận</Button>
                                    </div>
                                )
                            )}
                        </Container>
                    </div>
                }
            </HomeLayout >
        </>
    );
};

export default ProductDetail;
