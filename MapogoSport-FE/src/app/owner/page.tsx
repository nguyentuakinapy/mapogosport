'use client'
import { decodeString, formatPrice } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Modal, Nav, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import { useData } from "../context/UserContext";
import ProfileContent from "@/components/User/modal/user.profile";
import BlogManager from "@/components/blog/blog-manager";
import Wallet from "@/components/User/modal/wallet";
import Image from "next/image";
import Loading from "@/components/loading";

export default function Owner() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');
    const userData = useData();
    const [dataSport, setDataSport] = useState<SportField[]>();

    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [selectedAccountPackage, setSelectedAccountPackage] = useState<AccountPackage | null>(null);

    const { data: accountPackages } = useSWR<AccountPackage[]>(
        `http://localhost:8080/rest/accountpackage`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const { data: userSubscription } = useSWR<UserSubscription>(
        `http://localhost:8080/rest/user/subscription/${userData?.username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        const getOwner = async () => {
            if (userData) {
                const responseOwner = await fetch(`http://localhost:8080/rest/owner/${userData.username}`);
                if (!responseOwner.ok) {
                    throw new Error('Error fetching data');
                }
                const dataOwner = await responseOwner.json() as Owner;

                const response = await fetch(`http://localhost:8080/rest/sport_field_by_owner/${dataOwner.ownerId}`);
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                const dataS = await response.json() as SportField[];
                setDataSport(dataS);
            }
        };
        getOwner();
    }, [userData])

    const handleOpenModal = (ap: AccountPackage) => {
        setSelectedAccountPackage(ap);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPaymentMethod('');
    };

    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(e.target.value);
    };

    const handleUpdateSubscription = (ap?: AccountPackage) => {
        if (selectedPaymentMethod === "Thanh toán ví") {
            fetch(`http://localhost:8080/rest/user/subscription/updateUserSubscriptionByWallet/${userSubscription?.userSubscriptionId}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userSubscriptionId: userSubscription?.userSubscriptionId,
                    accountPackageId: ap?.accountPackageId,
                    paymentMethod: selectedPaymentMethod
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    toast.error(`Cập nhật không thành công! Chi tiết lỗi: ${errorText}`);
                    console.log(errorText);
                    handleCloseModal();
                }

                const data = await res.text();
                if (data === "ok") {
                    toast.success('Nâng cấp gói thành công');

                    mutate(`http://localhost:8080/rest/user/subscription/${userData?.username}`);
                    mutate(`http://localhost:8080/rest/wallet/transaction/${userData?.wallet.walletId}`);
                    handleCloseModal();
                } else {
                    toast.error(data);
                    handleCloseModal();
                }
            }).catch((error) => {
                toast.error(`Đã xảy ra lỗi: ${error.message}`);
                console.log(error);
                handleCloseModal();
            });
        } else {
            fetch(`http://localhost:8080/rest/user/subscription/${userSubscription?.userSubscriptionId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userSubscriptionId: userSubscription?.userSubscriptionId,
                    accountPackageId: ap?.accountPackageId,
                    paymentMethod: selectedPaymentMethod
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    toast.error(`Cập nhật không thành công! Chi tiết lỗi: ${errorText}`);
                    return;
                }

                const data = await res.json();
                if (data.status === "ok" && data.url) {
                    window.location.href = data.url;
                } else {
                    console.error();

                    toast.error("Có lỗi xảy ra trong quá trình tạo thanh toán.");
                }
            }).catch((error) => {
                toast.error(`Đã xảy ra lỗi: ${error.message}`);
            });
        }
    }

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setUsernameFetchApi(`http://localhost:8080/rest/user/${decodeString(username)}`);
        }
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div>
                        {usernameFetchApi && <ProfileContent usernameFetchApi={usernameFetchApi} />}
                    </div>
                );
            case 'post':
                return (
                    <BlogManager></BlogManager>
                );
            case 'bank':
                return (
                    <div className="font-14">
                        <Wallet />
                    </div>
                )
            case 'package':
                return (
                    <Row className="my-3" style={{ fontSize: '15px', height: '100%', display: 'flex' }}>
                        {accountPackages && accountPackages.map(ap => {
                            const isOwned = ap.accountPackageId ===
                                userSubscription?.accountPackage?.accountPackageId;
                            return (

                                <Col xs={4} key={ap.accountPackageId} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className="card packageUpdate">
                                        <b className="ms-3 mt-3 fs-5">{ap.packageName}</b>
                                        <div className="body-package my-3">
                                            {ap.accountPackageBenefits.map(apb => (
                                                <div key={apb.accountPackageBenefitId}>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    {apb.benefit.description}
                                                </div>
                                            ))}
                                        </div>
                                        <b className="text-danger ms-3">{ap.price == 0 ? 'Miễn phí' : formatPrice(ap.price)} / Tháng</b>
                                        {/* <Button className='btn-sub' onClick={() => handleUpdateSubscription(ap)} disabled={isOwned}>
                                            {isOwned ? "Đã sở hữu" : "Nâng cấp ngay"}
                                        </Button> */}
                                        {userSubscription && ap.accountPackageId <= userSubscription?.accountPackage?.accountPackageId ? (
                                            <Button className='btn-sub' onClick={() => handleUpdateSubscription(ap)} disabled={true}>
                                                Đã sở hữu
                                            </Button>
                                        ) : (
                                            <Button className='btn-sub' onClick={() => handleOpenModal(ap)} disabled={isOwned}>
                                                Nâng cấp ngay
                                            </Button>
                                        )}

                                    </div>
                                </Col>


                            )
                        })}
                    </Row >
                );
            default:
                return (
                    <div className="font-14">
                        Loading...
                    </div>
                );
        }
    };



    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="list-group">
                        <div className="card-body d-flex list-group-item align-items-center">
                            <div className="form-check flex-grow-1">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="vnpay"
                                    value="Thanh toán ví"
                                    onChange={handlePaymentMethodChange}
                                />
                                <label className="form-check-label" htmlFor="">
                                    Thanh toán bằng ví
                                </label>
                            </div>

                            <Image
                                src='/images/wallet icon.png'
                                alt=""
                                width={50} height={50}
                            />
                        </div>
                        <div className="card-body d-flex list-group-item align-items-center">
                            <div className="form-check flex-grow-1">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="vnpay"
                                    value="VNPay"
                                    onChange={handlePaymentMethodChange}
                                />
                                <label className="form-check-label" htmlFor="vnpay">
                                    Thanh toán qua ví điện tử VNPay
                                </label>
                            </div>
                            <Image
                                src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                alt="VNPay12312"
                                width={50} height={50}
                            />
                        </div>
                        <div className="card-body d-flex list-group-item align-items-center">
                            <div className="form-check flex-grow-1">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="momo"
                                    value="MoMo"
                                    onChange={handlePaymentMethodChange}
                                />
                                <label className="form-check-label" htmlFor="momo">
                                    Thanh toán qua ví điện tử MoMo
                                </label>
                            </div>
                            <Image
                                src="https://developers.momo.vn/v3/vi/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png"
                                alt="MoMo 123123"
                                width={50} height={50}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleUpdateSubscription(selectedAccountPackage || undefined)}
                        disabled={!selectedPaymentMethod}
                    >
                        Thanh toán
                    </Button>
                </Modal.Footer>
            </Modal>
            {!dataSport ?
                <div className="d-flex align-items-center justify-content-center" style={{
                    height: 'calc(100vh - 165px)'
                }}>
                    <Loading></Loading>
                </div>
                :
                <>
                    <div className="profile-header">
                        <div className="profile-info">
                            <h2>{userData?.fullname}</h2>
                            <p>Chào mừng bạn đến với hệ thống quản lý dành cho chủ sân của MapogoSport</p>
                            <div className="stats">
                                <span>0 Bài Viết</span>
                                <span>{dataSport && dataSport.length}/{userSubscription?.accountPackage.limitSportFields}</span>
                                <span>0 Được thích</span>
                                <span>
                                    {userSubscription && userSubscription.accountPackage ? userSubscription.accountPackage.packageName : 'Không có gói nào'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="font-14">
                        <Nav variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)} className="custom-tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="profile" className="tab-link">Thông tin cá nhân</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="post" className="tab-link">Bài viết</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="bank" className="tab-link">Ví & Tài khoản ngân hàng</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="package" className="tab-link">Gói nâng cấp</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div className="mt-3">
                            {renderContent()}
                        </div>
                    </div>
                </>
            }

        </>
    )
}

