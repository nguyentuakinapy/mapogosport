import UserLayout from "@/components/User/UserLayout"
import { Col, Row, Image } from "react-bootstrap";
import '../types/user.scss'

const CouponPage = () => {
    return (
        <UserLayout>
            <b className='text-danger' style={{ fontSize: '20px' }}>Kho voucher</b>
            <div style={{ fontSize: '15px' }}>
                <Row>
                    <Col xs={4} className="mt-4">
                        <div className="box-coupon py-2">
                            <div className="me-2">
                                <Image src={"/images/logo.png"} width={100} alt="LogoShop" />
                            </div>
                            <div className="box-coupon-content">
                                <b>Giảm 10%</b>
                                <div className="text-muted">CodeNek</div>
                                <div className="text-muted">Hết hạn: 01/10/2024</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </UserLayout>
    )
}

export default CouponPage;