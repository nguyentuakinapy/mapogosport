'use client'
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
import {formatPrice} from "@/components/Utils/Format"


const Categories = () => {
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
                                        src="https://img.thegioithethao.vn/media/icon/sale.gif" />
                                </span>
                                Danh sách sản phẩm
                            </h3>

                            {/* Product Item */}
                            {products.map((product, index) => (
                                <Col key={product.productId} lg={3} md={4} sm={6} xs={12} className="mb-4">
                                    <div nh-product={product.productId} className="product-item">
                                        <div className="inner-image mb-3">
                                            <div className="product-status">
                                                <div className="onsale"></div>
                                            </div>
                                            <div className="img ratio-1-1">
                                                <Link href="">
                                                    <img nh-lazy="image" className="img-fluid" alt={product.name}
                                                        src={`/images/Images_product/${typeof product.image === 'string' ? product.image : ''}`} />
                                                </Link>
                                            </div>
                                            <div className="product-action-wishlist">
                                                <Link href='' className="btn-product-action" title="Yêu thích">
                                                    {icon[index] ? (
                                                        <img
                                                            onClick={() => onClickIcon(index)}
                                                            src="/img/heart-svgrepo-com.svg"
                                                            alt="Yêu thích"
                                                            style={{ width: '25px', height: '25px' }} />
                                                    ) : (
                                                        <i
                                                            onClick={() => onClickIcon(index)}
                                                            className={`bi bi-heart ${icon[index] ? 'text-danger' : ''}`}
                                                        ></i>
                                                    )}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="inner-content">
                                            <div className="price">
                                                <span className="price-amount ms-1"> {formatPrice(product.price) }</span>
                                                {/* <span className="price-amount old-price me-1">{product.oldPrice}</span> */}
                                            </div>
                                            <div className="product-category ms-1">
                                                <Link href="">{product.categoryProduct.name}</Link>
                                            </div>
                                            <div className="product-title ms-1">
                                                <Link href="">{product.name}</Link>
                                            </div>
                                            <div className="d-flex mt-2" style={{ justifyContent: 'space-between', width: '100%' }}>
                                                <Link href={`/product-detail/${product.productId}`} className='btn btn-danger ms-1' style={{ fontSize: '14px', flexGrow: 1 }}>Mua Ngay</Link>
                                                <Link href='' className='btn btn-warning ms-2 me-1' style={{ fontSize: '14px', flexGrow: 1 }}>Thêm Giỏ Hàng</Link>
                                            </div>
                                            <div className="star-item star d-flex mt-1 ms-1">
                                                <div className="icon text-warning mb-2">
                                                    <i className="bi bi-star-fill"></i>
                                                    <i className="bi bi-star-fill"></i>
                                                    <i className="bi bi-star-fill"></i>
                                                    <i className="bi bi-star-fill"></i>
                                                    <i className="bi bi-star-fill"></i>
                                                </div>
                                                <div className="number">(1)</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </HomeLayout>
    );
};

export default Categories;
