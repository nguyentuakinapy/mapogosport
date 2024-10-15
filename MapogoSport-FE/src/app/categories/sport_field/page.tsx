'use client'
import { Container, Carousel, Row, Col, Image } from "react-bootstrap";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import '@/app/user/types/user.scss';



function Categories() {
    const categories = [
        { id: 1, name: "Cỏ nhân tạo", quantity: 10 },
        { id: 2, name: "Bóng", quantity: 10 },
        { id: 3, name: "Lưới khung thành", quantity: 10 },
        { id: 4, name: "Máy tập bóng đá", quantity: 10 },
        { id: 5, name: "Phụ kiện", quantity: 10 },
    ];

    const brands = [
        { id: 1, name: "xưởng của nhà làm" },
        { id: 2, name: "xưởng của nhà làm" },
        { id: 3, name: "xưởng của nhà làm" },
        { id: 4, name: "xưởng của nhà làm" },
        { id: 5, name: "xưởng của nhà làm" },
    ];
    const [rating, setRating] = useState<number>(1.5);
    const [sportFields, setSportFields] = useState<SportField[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/rest/sport_field');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setSportFields(data);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        };

        fetchData();
    }, []);

    const [products, setProducts] = useState<Product[]>([]);
    const [icon, setIcon] = useState<boolean[]>([]); // Để quản lý trạng thái của các biểu tượng

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/rest/products');
                const data = await response.json();
                console.log(data);
                setProducts(data);
                setIcon(new Array(data.length).fill(false)); // Khởi tạo trạng thái icon
            } catch (error) {
                console.log("Lỗi khi gọi API: ", error);
            }
        };
        fetchData();
    }, []);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5; // Kiểm tra nếu có nửa sao
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="bi bi-star-fill"></i>);
        }
        if (halfStar) {
            stars.push(<i key={fullStars} className="bi bi-star-half"></i>);
        }
        // Thêm sao trống
        for (let i = stars.length; i < 5; i++) {
            stars.push(<i key={i} className="bi bi-star"></i>);
        }
        return stars;
    };

    const onClickIcon = (index: number) => {
        setIcon(prev => {
            const newIcon = [...prev];
            newIcon[index] = !newIcon[index];
            return newIcon;
        });
    };

    return (
        <HomeLayout>
            <Container className='pt-5'>
                <Row>
                    {/* Sidebar responsive: hidden on small screens, show on larger */}
                    <Col lg={2} md={3} sm={12} className="mb-3">
                        <div className="d-flex mb-3">
                            <div className="fw-bold text-uppercase filter-panel">
                                <i className="bi bi-funnel"></i>
                                <span className="ms-2" style={{ fontSize: '1rem' }}>Bộ lọc tìm kiếm</span>
                            </div>
                        </div>

                        <div className="filter-group">
                            <legend className="fs-6">Theo Danh Mục</legend>
                            <div className="filter checkbox-filter">
                                {categories.map((category) => (
                                    <label key={category.id} className="checkbox mb-1">
                                        <input type="checkbox" />
                                        <span className="checkbox__label ms-2">
                                            {category.name} ({category.quantity} sản phẩm)
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <legend className="fs-6">Thương hiệu</legend>
                            <div className="filter checkbox-filter">
                                {brands.map((brand) => (
                                    <label key={brand.id} className="checkbox mb-1">
                                        <input type="checkbox" />
                                        <span className="checkbox__label ms-2">{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* Product list */}
                    <Col lg={10} md={9} sm={12}>
                        <Row>
                            <h3 className="title-section mb-4">
                                <span className="icon">
                                    <img nh-lazy="image" className="img-fluid" alt="Flash Sale"
                                        src="https://media.tenor.com/zc4ZHOVUylEAAAAi/philcorbett-football.gif" />
                                </span>
                                Danh sách sân
                            </h3>

                            {/* Product Item */}
                            <div>
                                {/* <h3 className="fw-bold mt-5">SÂN THỂ THAO MỚI</h3> */}
                                <div style={{ fontSize: '15px' }}>
                                    <Row className="my-3">
                                        {sportFields.map((field: SportField) => (
                                            <Col xs={3} key={field.sportFieldId}>
                                                <div className="user-border">
                                                    <div className="mb-3">
                                                        <Link href={"#"}>
                                                            <Image src={`/images/${field.image}`} alt={field.name} />
                                                        </Link>
                                                    </div>
                                                    <div className="content">
                                                        <div className="mb-1 title">
                                                            <Link href={"#"}><b>{field.name}</b></Link>
                                                        </div>
                                                        <div className="address mb-1">
                                                            <span className="me-2">Khu vực:</span>{field.address}
                                                            <span className="mx-2">-</span>Hồ Chí Minh
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>Số sân: {field.quantity}</div>
                                                            <div className="star-item text-warning">
                                                                {renderStars(rating)}
                                                            </div>
                                                        </div>
                                                        <Link href={`/sport-detail/${field.sportFieldId}`} className="btn btn-user mt-2">Đặt sân</Link>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </HomeLayout>
    );
}

export default Categories;
