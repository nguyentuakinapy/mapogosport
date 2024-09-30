'use client'
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';
import HomeLayout from '@/components/HomeLayout';
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
    const [icon, setIcon] = useState(false);
    const onClickIcon = () => {
        setIcon(prevIcon => !prevIcon);
    };

    const isSelectIcon = icon; // Biến này sẽ là true hoặc false tùy thuộc vào trạng thái của icon.


    return (

        <HomeLayout>
            <Container>
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
                                {categories.map((category) => {
                                    return (
                                        <label key={category.id} className="checkbox mb-1">
                                            <input type="checkbox" name="" />
                                            <span className="checkbox__label ms-2">{category.name} ({category.quantity} sản phẩm)</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="filter-group">
                            <legend className="fs-6">Thương hiệu</legend>
                            <div className="filter checkbox-filter">
                                {brands.map((brand) => {
                                    return (
                                        <label key={brand.id} className="checkbox mb-1">
                                            <input type="checkbox" name="" />
                                            <span className="checkbox__label ms-2">{brand.name}</span>
                                        </label>
                                    );
                                })}
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
                            <Col lg={3} md={4} sm={6} xs={12} className="mb-4">
                                <div nh-product="2045" className="product-item">
                                    <div className="inner-image mb-3">
                                        <div className="product-status">
                                            <div className="onsale"></div>
                                        </div>
                                        <div className="img ratio-1-1">
                                            <Link href="">
                                                <img nh-lazy="image" className="img-fluid" alt="Lưới bóng đá goal 11 người"
                                                    src="https://img.thegioithethao.vn/thumbs/product/bong-da/luoi-bong-da/luoi-bong-da-goal-11-nguoi-172045/luoi-bong-da-11-nguoi-172045_thumb_350.webp" />
                                            </Link>
                                        </div>
                                        <div className="product-action-wishlist">
                                            <Link href='' className="btn-product-action" title="Yêu thích" >

                                                {isSelectIcon ? (
                                                    <img onClick={() => onClickIcon()}
                                                        src="/img/heart-svgrepo-com.svg" // Đường dẫn đến hình ảnh SVG
                                                        alt="Yêu thích"
                                                        style={{ width: '25px', height: '25px' }} // Điều chỉnh kích thước theo ý muốn
                                                    />

                                                ) :

                                                    <i
                                                        onClick={() => onClickIcon()}
                                                        className={`bi bi-heart ${isSelectIcon ? 'text-danger' : ''}`} // Thêm lớp CSS để thay đổi màu sắc
                                                    ></i>
                                                }

                                            </Link>
                                        </div>
                                    </div>
                                    <div className="inner-content">
                                        <div className="price">
                                            <span className="price-amount ms-1 ">35.000.000 ₫</span>
                                            <span className="price-amount old-price me-1">40.000.000 ₫</span>
                                        </div>
                                        <div className="product-category ms-1">
                                            <Link href="">Lưới &amp; Khung thành</Link>
                                        </div>
                                        <div className="product-title ms-1">
                                            <Link href="">Lưới bóng đá goal 11 người</Link>
                                        </div>
                                        <div className="d-flex mt-2" style={{ justifyContent: 'space-between', width: '100%' }}>
                                            <Link href='' className='btn btn-danger  ms-1 ' style={{ fontSize: '15px', flexGrow: 1 }}>Mua Ngay</Link>
                                            <Link href='' className='btn btn-warning ms-2 me-1' style={{ fontSize: '15px', flexGrow: 1 }}>Thêm Giỏ Hàng</Link>
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
                            <Col lg={3} md={4} sm={6} xs={12} className="mb-4">
                                <div nh-product="2045" className="product-item">
                                    <div className="inner-image mb-3">
                                        <div className="product-status">
                                            <div className="onsale"></div>
                                        </div>
                                        <div className="img ratio-1-1">
                                            <Link href="">
                                                <img nh-lazy="image" className="img-fluid" alt="Lưới bóng đá goal 11 người"
                                                    src="https://img.thegioithethao.vn/thumbs/product/bong-da/luoi-bong-da/luoi-bong-da-goal-11-nguoi-172045/luoi-bong-da-11-nguoi-172045_thumb_350.webp" />
                                            </Link>
                                        </div>
                                        <div className="product-action-wishlist">
                                            <Link href='' className="btn-product-action" title="Yêu thích" >

                                                {isSelectIcon ? (
                                                    <img onClick={() => onClickIcon()}
                                                        src="/img/heart-svgrepo-com.svg" // Đường dẫn đến hình ảnh SVG
                                                        alt="Yêu thích"
                                                        style={{ width: '25px', height: '25px' }} // Điều chỉnh kích thước theo ý muốn
                                                    />

                                                ) :

                                                    <i
                                                        onClick={() => onClickIcon()}
                                                        className={`bi bi-heart ${isSelectIcon ? 'text-danger' : ''}`} // Thêm lớp CSS để thay đổi màu sắc
                                                    ></i>
                                                }

                                            </Link>
                                        </div>
                                    </div>
                                    <div className="inner-content">
                                        <div className="price">
                                            <span className="price-amount ms-1 ">35.000.000 ₫</span>
                                            <span className="price-amount old-price me-1">40.000.000 ₫</span>
                                        </div>
                                        <div className="product-category ms-1">
                                            <Link href="">Lưới &amp; Khung thành</Link>
                                        </div>
                                        <div className="product-title ms-1">
                                            <Link href="">Lưới bóng đá goal 11 người</Link>
                                        </div>
                                        <div className="d-flex mt-2" style={{ justifyContent: 'space-between', width: '100%' }}>
                                            <Link href='' className='btn btn-danger  ms-1 ' style={{ fontSize: '15px', flexGrow: 1 }}>Mua Ngay</Link>
                                            <Link href='' className='btn btn-warning ms-2 me-1' style={{ fontSize: '15px', flexGrow: 1 }}>Thêm Giỏ Hàng</Link>
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
                            <Col lg={3} md={4} sm={6} xs={12} className="mb-4">
                                <div nh-product="2045" className="product-item">
                                    <div className="inner-image mb-3">
                                        <div className="product-status">
                                            <div className="onsale"></div>
                                        </div>
                                        <div className="img ratio-1-1">
                                            <Link href="">
                                                <img nh-lazy="image" className="img-fluid" alt="Lưới bóng đá goal 11 người"
                                                    src="https://img.thegioithethao.vn/thumbs/product/bong-da/luoi-bong-da/luoi-bong-da-goal-11-nguoi-172045/luoi-bong-da-11-nguoi-172045_thumb_350.webp" />
                                            </Link>
                                        </div>
                                        <div className="product-action-wishlist">
                                            <Link href='' className="btn-product-action" title="Yêu thích" >

                                                {isSelectIcon ? (
                                                    <img onClick={() => onClickIcon()}
                                                        src="/img/heart-svgrepo-com.svg" // Đường dẫn đến hình ảnh SVG
                                                        alt="Yêu thích"
                                                        style={{ width: '25px', height: '25px' }} // Điều chỉnh kích thước theo ý muốn
                                                    />

                                                ) :

                                                    <i
                                                        onClick={() => onClickIcon()}
                                                        className={`bi bi-heart ${isSelectIcon ? 'text-danger' : ''}`} // Thêm lớp CSS để thay đổi màu sắc
                                                    ></i>
                                                }

                                            </Link>
                                        </div>
                                    </div>
                                    <div className="inner-content">
                                        <div className="price">
                                            <span className="price-amount ms-1 ">35.000.000 ₫</span>
                                            <span className="price-amount old-price me-1">40.000.000 ₫</span>
                                        </div>
                                        <div className="product-category ms-1">
                                            <Link href="">Lưới &amp; Khung thành</Link>
                                        </div>
                                        <div className="product-title ms-1">
                                            <Link href="">Lưới bóng đá goal 11 người</Link>
                                        </div>
                                        <div className="d-flex mt-2" style={{ justifyContent: 'space-between', width: '100%' }}>
                                            <Link href='' className='btn btn-danger  ms-1 ' style={{ fontSize: '15px', flexGrow: 1 }}>Mua Ngay</Link>
                                            <Link href='' className='btn btn-warning ms-2 me-1' style={{ fontSize: '15px', flexGrow: 1 }}>Thêm Giỏ Hàng</Link>
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
                            <Col lg={3} md={4} sm={6} xs={12} className="mb-4">
                                <div nh-product="2045" className="product-item">
                                    <div className="inner-image mb-3">
                                        <div className="product-status">
                                            <div className="onsale"></div>
                                        </div>
                                        <div className="img ratio-1-1">
                                            <Link href="">
                                                <img nh-lazy="image" className="img-fluid" alt="Lưới bóng đá goal 11 người"
                                                    src="https://img.thegioithethao.vn/thumbs/product/bong-da/luoi-bong-da/luoi-bong-da-goal-11-nguoi-172045/luoi-bong-da-11-nguoi-172045_thumb_350.webp" />
                                            </Link>
                                        </div>
                                        <div className="product-action-wishlist">
                                            <Link href='' className="btn-product-action" title="Yêu thích" >

                                                {isSelectIcon ? (
                                                    <img onClick={() => onClickIcon()}
                                                        src="/img/heart-svgrepo-com.svg" // Đường dẫn đến hình ảnh SVG
                                                        alt="Yêu thích"
                                                        style={{ width: '25px', height: '25px' }} // Điều chỉnh kích thước theo ý muốn
                                                    />

                                                ) :

                                                    <i
                                                        onClick={() => onClickIcon()}
                                                        className={`bi bi-heart ${isSelectIcon ? 'text-danger' : ''}`} // Thêm lớp CSS để thay đổi màu sắc
                                                    ></i>
                                                }

                                            </Link>
                                        </div>
                                    </div>
                                    <div className="inner-content">
                                        <div className="price">
                                            <span className="price-amount ms-1 ">35.000.000 ₫</span>
                                            <span className="price-amount old-price me-1">40.000.000 ₫</span>
                                        </div>
                                        <div className="product-category ms-1">
                                            <Link href="">Lưới &amp; Khung thành</Link>
                                        </div>
                                        <div className="product-title ms-1">
                                            <Link href="">Lưới bóng đá goal 11 người</Link>
                                        </div>
                                        <div className="d-flex mt-2" style={{ justifyContent: 'space-between', width: '100%' }}>
                                            <Link href='' className='btn btn-danger  ms-1 ' style={{ fontSize: '15px', flexGrow: 1 }}>Mua Ngay</Link>
                                            <Link href='' className='btn btn-warning ms-2 me-1' style={{ fontSize: '15px', flexGrow: 1 }}>Thêm Giỏ Hàng</Link>
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



                            {/* Thêm các sản phẩm khác ở đây */}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </HomeLayout>
    );
}

export default Categories;
