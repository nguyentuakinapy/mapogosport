'use client'
import { decodeString, formatPrice } from "@/components/Utils/Format";
import { Suspense, useEffect, useState } from "react";
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
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [activeTab, setActiveTab] = useState<string>('profile');
    const userData = useData();
    const [dataSport, setDataSport] = useState<SportField[]>();

    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [selectedAccountPackage, setSelectedAccountPackage] = useState<AccountPackage | null>(null);

    const { data: accountPackages } = useSWR<AccountPackage[]>(
        `${BASE_URL}rest/accountpackage`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const { data: userSubscription } = useSWR<UserSubscription>(
        `${BASE_URL}rest/user/subscription/${userData?.username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        const getOwner = async () => {
            if (userData) {
                const responseOwner = await fetch(`${BASE_URL}rest/owner/${userData.username}`);
                if (!responseOwner.ok) {
                    throw new Error('Error fetching data');
                }
                const dataOwner = await responseOwner.json() as Owner;

                const response = await fetch(`${BASE_URL}rest/sport_field_by_owner/${dataOwner.ownerId}`);
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                const dataS = await response.json() as SportField[];
                setDataSport(dataS);
            }
        };
        getOwner();
    }, [userData])
    const [updateOrExtend, setUpdateOrExtend] = useState<boolean>();

    const handleOpenModal = (ap: AccountPackage, updateOrExtend: boolean) => {
        setUpdateOrExtend(updateOrExtend);
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
            fetch(`${BASE_URL}rest/user/subscription/updateUserSubscriptionByWallet/${userSubscription?.userSubscriptionId}`, {
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

                    mutate(`${BASE_URL}rest/user/subscription/${userData?.username}`);
                    mutate(`${BASE_URL}rest/wallet/transaction/${userData?.wallet.walletId}`);
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
            fetch(`${BASE_URL}rest/user/subscription/${userSubscription?.userSubscriptionId}`, {
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

    const handleExtendSubscription = (ap?: AccountPackage) => {
        const endDate = new Date(userSubscription!.endDay);

        const futureDate = new Date(endDate);
        futureDate.setDate(endDate.getDate() + 30);

        if (selectedPaymentMethod === "Thanh toán ví") {
            if (userData!.wallet.balance > ap!.price) {
                fetch(`${BASE_URL}rest/user/subscription/extend/${userSubscription?.userSubscriptionId}/${futureDate}`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                }).then(async (res) => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        toast.error(`Cập nhật không thành công! Chi tiết lỗi: ${errorText}`);
                        return;
                    }

                    toast.success('Gia hạn thành công');
                    handleCloseModal();

                    mutate(`${BASE_URL}rest/user/subscription/${userData!.username}`);
                    mutate(`${BASE_URL}rest/wallet/transaction/${userData!.wallet.walletId}`);

                }).catch((error) => {
                    toast.error(`Đã xảy ra lỗi: ${error.message}`);
                });
            } else {
                toast.error('Số dư tài khoản không đủ, vui lòng thanh toán bằng phương thức khác hoặc nạp thêm tiền!');
                handleCloseModal();
            }
        } else {

        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div>
                        {userData && <ProfileContent user={userData} />}
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
                                        <b className="text-danger ms-3">{ap.price == 0 ? 'Miễn phí' : formatPrice(ap.price) + " / tháng"}</b>
                                        {userSubscription && ap.accountPackageId <= userSubscription?.accountPackage?.accountPackageId ? (
                                            userSubscription.accountPackage.accountPackageId === ap.accountPackageId ?
                                                userSubscription.accountPackage.packageName === "Gói miễn phí" ?
                                                    <Button className='btn-sub' disabled={true}>
                                                        Đã sở hữu
                                                    </Button>
                                                    :
                                                    <Button className='btn-sub' onClick={() => handleOpenModal(ap, false)}>
                                                        Gia hạn ngay
                                                    </Button>
                                                :
                                                <Button className='btn-sub' disabled={true}>
                                                    Đã sở hữu
                                                </Button>
                                        ) : (
                                            <Button className='btn-sub' onClick={() => handleOpenModal(ap, true)} disabled={isOwned}>
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
        <Suspense fallback={<div>Đang tải...</div>}>
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
                        onClick={() => updateOrExtend ? handleUpdateSubscription(selectedAccountPackage || undefined) : handleExtendSubscription(selectedAccountPackage || undefined)}
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
                                <span>{dataSport && dataSport.length}/{userSubscription?.accountPackage.limitSportFields} khu vực</span>
                                <span>0 Được thích</span>
                                <span>
                                    {userSubscription && userSubscription.accountPackage ? userSubscription.accountPackage.packageName : 'Không có gói nào'}
                                    <em> (Còn {
                                        userSubscription?.endDay ?
                                            Math.floor((new Date(userSubscription.endDay).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 'Không xác định'
                                    } ngày)</em>
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
        </Suspense>
    )
}

