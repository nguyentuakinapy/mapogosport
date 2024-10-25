import { formatPrice } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface OwnerProps {
    showCreateOwnerModal: boolean;
    setShowCreateOwnerModal: (v: boolean) => void;
    userData?: User;
}

const CreateOwnerModal = (props: OwnerProps) => {
    const { showCreateOwnerModal, setShowCreateOwnerModal, userData } = props;

    const [authority, setAuthority] = useState<number>(3);


    const [accountPackage, setAccountPackage] = useState<AccountPackage[]>();
    const [accountPackageTemporary, setAccountPackageTemporary,] = useState<AccountPackage>();
    const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethod[]>();

    const [paymentMethodId, setPaymentMethodId] = useState<number>(0);
    const [page, setPage] = useState<boolean>(true);

    const [bankAccount, setBankAccount] = useState<string>("");
    const [momoAccount, setMomoAccount] = useState<string>("");
    const [vnpayAccount, setVnpayAccount] = useState<string>("");



    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data: ap, error: erAp, isLoading: isLoadingAp } = useSWR(
        `http://localhost:8080/rest/accountpackage`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setAccountPackage(ap);
    }, [ap])

    const { data: dataPM, error: errorPM, isLoading: isLoadingPM } = useSWR(
        `http://localhost:8080/rest/paymentMethod`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setDataPaymentMethod(dataPM);
    }, [dataPM])

    const handleClose = () => {
        setShowCreateOwnerModal(false);
    }

    const handleClick = (ap: AccountPackage) => {
        toast.success(ap.packageName)
        setAccountPackageTemporary(ap);
        setPage(false);
    }

    const handleSubmit = async () => {
        const responseUserSubscription = await fetch('http://localhost:8080/rest/user/subscription', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json' // Không cần charset=UTF-8
            },
            body: JSON.stringify({
                accountPackageId: accountPackageTemporary?.accountPackageId,
                username: userData?.username,
                startDay: new Date().toLocaleDateString(),
                endDay: new Date(new Date().setDate(new Date().getDate() + (accountPackageTemporary?.durationDays || 0))).toLocaleDateString(),
                status: 'Đã thanh toán'
            })
        })

        if (!responseUserSubscription.ok) {
            throw new Error('Network response was not ok');
        }

        const resSubscription = await responseUserSubscription.json() as Booking;

        const responseOwner = await fetch('http://localhost:8080/rest/owner', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json' // Không cần charset=UTF-8
            },
            body: JSON.stringify({
                username: userData?.username,
                bankAccount: "",
                momoAccount: "",
                vnpayAccount: ""
            })
        })

        if (!responseOwner.ok) {
            throw new Error('Network response was not ok');
        }

        const resOwner = await responseOwner.json() as Owner;

        const responseAuth = await fetch('http://localhost:8080/rest/authority', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: {
                    roleId: authority // Role phải có ID
                },
                user: {
                    username: userData?.username // User phải có username
                }
            })
        });

        if (!responseAuth.ok) {
            throw new Error('Network response was not ok');
        }

        const resAuth = await responseAuth.json(); // Sửa lại dòng này

        if (resSubscription && resOwner && resAuth) {
            mutate(`http://localhost:8080/rest/user/${userData?.username}`);
            toast.success('Cập nhật thành công! ');
        } else {
            toast.success('Cập nhật thất bại! ');
        }
    }

    return (
        <Modal show={showCreateOwnerModal} onHide={() => handleClose()} size="xl" aria-labelledby="contained-modal-title-vcenter"
            centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title className="text-uppercase text-danger fw-bold m-auto">ĐĂNG KÝ TÀI KHOẢN CHỦ SÂN</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {page ?
                    <Row className="my-3" style={{ fontSize: '15px' }}>
                        {accountPackage && accountPackage.map(ap => {
                            return (
                                <Col xs={4} key={ap.accountPackageId}>
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
                                        <b className="text-danger ms-3">{ap.price == 0 ? 'Miễn phí' : formatPrice(ap.price)}</b>
                                        <Button onClick={() => handleClick(ap)} className='btn-sub'>Đăng ký ngay</Button>
                                    </div>
                                </Col>
                            )
                        })}
                        <Button onClick={() => setShowCreateOwnerModal(false)} className="btn btn-secondary">Hủy</Button>

                    </Row>
                    :
                    <Row>
                        <Col>
                            <h6 style={{ textTransform: 'uppercase' }} className="text-danger text-center fw-bold">Thông tin cá nhân</h6>
                            <Row>
                                <Col>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control"
                                            value={userData?.fullname} disabled
                                        />
                                        <label>Họ và tên <b className="text-danger">*</b></label>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control"
                                            value={userData?.email} disabled
                                        />
                                        <label>Email <b className="text-danger">*</b></label>
                                    </div>
                                </Col>
                            </Row>
                            <div className="form-floating mb-3">
                                <select className="form-select">
                                    {userData && userData.addressUsers.length > 0 &&
                                        userData.addressUsers.map((adU, index) => (
                                            <option selected={index === 0} key={adU.address.addressId} value={adU.address.addressId}>{adU.addressDetail}, {adU.address.ward}, {adU.address.district}, {adU.address.province}.</option>
                                        ))
                                    }
                                </select>
                                <label>Sổ địa chỉ <b className="text-danger">*</b></label>
                            </div>
                            <Row>
                                <Col>
                                    <div className="form-floating mb-3">
                                        <select className="form-select">
                                            {userData && userData.addressUsers.length > 0 &&
                                                userData.addressUsers.map((adU, index) => (
                                                    <option selected={index === 0} key={adU.address.addressId} value={adU.address.addressId}>{adU.phoneNumber}.</option>
                                                ))
                                            }
                                        </select>
                                        <label>Số điện thoại <b className="text-danger">*</b></label>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control"
                                            value={userData?.gender == 0 ? 'Nam' : 'Nữ'} disabled
                                        />
                                        <label>Giới tính <b className="text-danger">*</b></label>
                                    </div>
                                </Col>
                            </Row>
                            <h6 style={{ textTransform: 'uppercase' }} className="text-danger text-center fw-bold">Thông tin chủ sân</h6>
                            <div className="form-floating mb-3">
                                <input
                                    value={bankAccount}
                                    onChange={(e) => setBankAccount(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    id="bankAccount"
                                    name="bankAccount"
                                    placeholder="Enter your Bank Account"
                                    required
                                />
                                <label htmlFor="bankAccount">Bank Account <b className="text-danger">*</b></label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    value={momoAccount}
                                    onChange={(e) => setMomoAccount(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    id="momoAccount"
                                    name="momoAccount"
                                    placeholder="Enter your Momo Account"
                                    required
                                />
                                <label htmlFor="momoAccount">Momo Account <b className="text-danger">*</b></label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    value={vnpayAccount}
                                    onChange={(e) => setVnpayAccount(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    id="vnpayAccount"
                                    name="vnpayAccount"
                                    placeholder="Enter your VNPAY Account"
                                    required
                                />
                                <label htmlFor="vnpayAccount">VNPAY Account <b className="text-danger">*</b></label>
                            </div>
                        </Col>
                        <Col>
                            <h6 style={{ textTransform: 'uppercase' }} className="text-danger text-center fw-bold">
                                Chức năng {accountPackageTemporary?.packageName}</h6>
                            <Col >
                                <div className=" my-3">
                                    {accountPackageTemporary?.accountPackageBenefits.map(apb => {
                                        return (
                                            <div>
                                                <i key={apb.accountPackageBenefitId} className="bi bi-check-circle me-2"></i>
                                                {apb.benefit.description}
                                            </div>
                                        )
                                    })}
                                </div>
                            </Col>

                            <h6 style={{ textTransform: 'uppercase' }} className="text-danger text-center fw-bold mt-3">
                                Thanh toán</h6>
                            <div className="form-floating mb-3">
                                <select value={paymentMethodId}
                                    onChange={(e) => setPaymentMethodId(Number(e.target.value))}
                                    className="form-select" aria-label="Default select example">
                                    {dataPaymentMethod && (
                                        dataPaymentMethod.map((item) => (
                                            <option key={item.paymentMethodId} value={item.paymentMethodId}>{item.name}</option>
                                        ))
                                    )}
                                </select>
                                <label>Phương thức thanh toán <b className="text-danger">*</b></label>
                            </div>
                            <b>Giá:</b> <b className="text-danger mb-3">{accountPackageTemporary?.price == 0 ? 'Miễn phí' : formatPrice(accountPackageTemporary?.price)}</b><br />
                            <b className="me-2">Hạn sử dụng:</b>
                            {accountPackageTemporary && accountPackageTemporary.durationDays === 0 ? (
                                <b className="text-danger mb-3">Không giới hạn</b>
                            ) : (
                                <>
                                    <b className="text-danger mb-3">{new Date().toLocaleDateString()}</b>
                                    <b> - </b>
                                    <b className="text-danger mb-3">
                                        {new Date(new Date().setDate(new Date().getDate() + (accountPackageTemporary?.durationDays || 0))).toLocaleDateString()}
                                    </b>
                                </>
                            )}
                        </Col>
                        <div className="d-flex justify-content-around">
                            <Button onClick={() => setPage(true)} className="btn btn-primary">Quay lại</Button>
                            <Button onClick={() => handleSubmit()} className="btn btn-danger">Thanh toán</Button>
                            <Button onClick={() => setShowCreateOwnerModal(false)} className="btn btn-secondary">Hủy</Button>
                        </div>
                    </Row>
                }
            </Modal.Body>
        </Modal >
    )
}

// <Modal.Footer>
// <Button variant="secondary" onClick={() => handleClose()}>
//     Hủy
// </Button>
// {/* <Button style={{ backgroundColor: "#142239" }} onClick={() => handleSave()}>Xác nhận</Button> */}
// </Modal.Footer>

export default CreateOwnerModal;