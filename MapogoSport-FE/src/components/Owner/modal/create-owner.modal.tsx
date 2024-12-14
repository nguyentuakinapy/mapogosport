import { formatPrice } from "@/components/Utils/Format";
import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import Cookies from 'js-cookie';

interface OwnerProps {
    showCreateOwnerModal: boolean;
    setShowCreateOwnerModal: (v: boolean) => void;
    userData?: User;
}

const CreateOwnerModal = (props: OwnerProps) => {
    const { showCreateOwnerModal, setShowCreateOwnerModal, userData } = props;

    const authority: number = 3;
    const [checkPaymentMethod, setCheckPaymentMethod] = useState<boolean>(true);

    const [accountPackage, setAccountPackage] = useState<AccountPackage[]>();
    const [accountPackageTemporary, setAccountPackageTemporary,] = useState<AccountPackage>();
    const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethod[]>();

    const [paymentMethodId, setPaymentMethodId] = useState<number>(0);
    const [page, setPage] = useState<boolean>(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // const [bankAccount, setBankAccount] = useState<string>("");
    // const [momoAccount, setMomoAccount] = useState<string>("");
    // const [vnpayAccount, setVnpayAccount] = useState<string>("");


    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data: ap } = useSWR(
        `${BASE_URL}rest/accountpackage`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setAccountPackage(ap);
    }, [ap])

    const { data: dataPM } = useSWR(
        `${BASE_URL}rest/paymentMethod`, fetcher, {
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
        setAccountPackageTemporary(ap);
        setPage(false);
    }

    //Myj

    const createOwnerAccount = async (apTemp: AccountPackage) => {
        const responseUserSubscription = await fetch(`${BASE_URL}rest/user/subscription`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json' // Không cần charset=UTF-8
            },
            body: JSON.stringify({
                accountPackageId: apTemp.accountPackageId,
                username: userData?.username,
                startDay: new Date().toLocaleDateString(),
                endDay: new Date(new Date().setDate(new Date().getDate() + (apTemp.durationDays || 0))).toLocaleDateString(),
                status: 'Đã thanh toán'
            })
        })

        if (!responseUserSubscription.ok) {
            throw new Error('Network response was not ok');
        }

        const resSubscription = await responseUserSubscription.json() as UserSubscription;
        const userSubscriptionId = resSubscription.userSubscriptionId;
        console.log(">>>>resSubscription: ", resSubscription);

        const responseOwner = await fetch(`${BASE_URL}rest/owner`, {
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
        const ownerId = resOwner.ownerId;

        const responseAuth = await fetch(`${BASE_URL}rest/authority`, {
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
        const authorityId = resAuth.authorityId;

        if (resSubscription && resOwner && resAuth) {
            mutate(`${BASE_URL}rest/user/${userData?.username}`);

            try {
                const responseAuth = await fetch(`${BASE_URL}rest/user/${userData?.username}`);
                const data = await responseAuth.json() as User;

                Cookies.remove('sessionDataAuth'); // Dành cho cookie không có HttpOnly

                await fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),

                }).then(async (response) => {
                    const payload = await response.json();
                    const data = {
                        status: response.status,
                        payload
                    }
                    if (!response.ok) {
                        throw data
                    }
                    return data
                })
            } catch (error) {
            }

            // toast.success('Đăng ký trở thành chủ sân thành công! ');
            handleClose();

        } else {
            toast.success('Cập nhật thất bại! ');
        }

        return { userSubscriptionId, ownerId, authorityId };

    }


    const handleSubmit = async () => {
        if (checkPaymentMethod && accountPackageTemporary) {
            if (accountPackageTemporary.price === 0) {
                await createOwnerAccount(accountPackageTemporary);
                window.location.href = '/owner'
            } else {
                if (userData && accountPackageTemporary && userData.wallet.balance >= accountPackageTemporary.price) {
                    await createOwnerAccount(accountPackageTemporary);
                    const responseWallet = await fetch(`${BASE_URL}rest/wallet/create/owner/${userData?.username}/${accountPackageTemporary?.price}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                    });

                    if (!responseWallet.ok) {
                        throw new Error('Network response was not ok');
                    }

                    window.location.href = '/owner'
                } else {
                    toast.warning("Số dư của bạn không đủ");
                }
            }
        } else if (accountPackageTemporary) {
            if (paymentMethodId === 0) {
                toast.warning("Vui lòng chọn phương thức thanh toán!");
                return;
            }
            if (accountPackageTemporary.price === 0) {
                await createOwnerAccount(accountPackageTemporary);
            } else {
                const accountData = await createOwnerAccount(accountPackageTemporary);
                try {
                    const responsePayment = await fetch(`${BASE_URL}rest/subscription/payment`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userSubscriptionId: accountData.userSubscriptionId,
                            ownerId: accountData.ownerId,
                            authorityId: accountData.authorityId,
                            paymentMethodId: paymentMethodId,
                        })
                    });
                    const responseData = await responsePayment.json();
                    const paymentUrl = responseData.url;
                    // chuyển hướng đến URL thanh toán
                    window.location.href = paymentUrl;
                } catch (error) {
                    console.error('Error during payment:', error);
                }
            }
        }
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckPaymentMethod(event.target.value === 'prepay');
    };

    return (
        <Modal show={showCreateOwnerModal} onHide={() => handleClose()} size="xl" aria-labelledby="contained-modal-title-vcenter"
            centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title className="text-uppercase text-danger fw-bold m-auto">ĐĂNG KÝ TÀI KHOẢN CHỦ SÂN</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {page ?
                    <Row className="my-3" style={{ fontSize: '15px', height: '100%', display: 'flex' }}>
                        {accountPackage && accountPackage.filter(item => item.status === "active").map(ap => {
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
                                        <b className="text-danger ms-3">{ap.price == 0 ? 'Miễn phí' : formatPrice(ap.price)}</b>
                                        <Button onClick={() => handleClick(ap)} className='btn-sub'>Đăng ký ngay</Button>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    :
                    <Row>
                        <Col>
                            <h6 style={{ textTransform: 'uppercase' }} className="text-danger text-center fw-bold">Thông tin cá nhân</h6>
                            <Row>
                                <Col md={9}>
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
                                            value={userData?.gender === null ? "Không có" : userData?.gender === 0 ? 'Nam' : 'Nữ'} disabled
                                        />
                                        <label>Giới tính </label>
                                    </div>

                                </Col>
                            </Row>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control"
                                    value={userData?.email} disabled
                                />
                                <label>Email <b className="text-danger">*</b></label>
                            </div>
                            <div className="form-floating mb-3">
                                <select className="form-select">
                                    {userData && userData.addressUsers.length > 0 ?
                                        userData.addressUsers.map((adU, index) => (
                                            <option selected={index === 0} key={adU.address.addressId} value={adU.address.addressId}>{adU.addressDetail}, {adU.address.ward}, {adU.address.district}, {adU.address.province}.</option>
                                        ))
                                        :
                                        <option value="">Bạn chưa thêm địa chỉ</option>
                                    }
                                </select>
                                <label>Sổ địa chỉ</label>
                            </div>
                            <Row>
                                <div className="form-floating mb-3">
                                    <select className="form-select">

                                        {userData && userData.phoneNumberUsers.length > 0 ?
                                            userData.phoneNumberUsers.map((pNu, index) => (
                                                <option selected={index === 0} key={pNu.phoneNumberUserId} value={pNu.phoneNumber.phoneNumber}>{pNu.phoneNumber.phoneNumber}</option>
                                            ))
                                            :
                                            <option value="">Bạn chưa thêm số điện thoại</option>
                                        }
                                    </select>
                                    <label className="ms-3">Số điện thoại</label>
                                </div>
                            </Row>
                        </Col>
                        <Col>
                            <h6 style={{ textTransform: 'uppercase' }} className="text-danger text-center fw-bold">
                                Chức năng và thanh toán {accountPackageTemporary?.packageName}</h6>
                            <Col >
                                <div className=" my-3">
                                    {accountPackageTemporary?.accountPackageBenefits.map(apb => {
                                        return (
                                            <div key={apb.accountPackageBenefitId}>
                                                <i className="bi bi-check-circle me-2"></i>
                                                {apb.benefit.description}
                                            </div>
                                        )
                                    })}
                                </div>
                            </Col>
                            <div className="d-flex justify-content-center mb-3">
                                <div className="form-check me-5">
                                    <input
                                        value="prepay"
                                        checked={checkPaymentMethod}
                                        onChange={handleRadioChange}
                                        className="form-check-input border"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="flexRadioDefault1"
                                    />
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                        Thanh toán bằng ví
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        value="full"
                                        checked={!checkPaymentMethod}
                                        onChange={handleRadioChange}
                                        className="form-check-input border"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="flexRadioDefault2"
                                    />
                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                        Thanh toán chuyển khoản
                                    </label>
                                </div>
                            </div>
                            {checkPaymentMethod ?
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control"
                                        value={userData?.wallet.balance.toLocaleString() + ' đ'} disabled
                                    />
                                    <label>Số dư ví của bạn<b className="text-danger">*</b></label>
                                </div>
                                :
                                <div className="form-floating mb-3">
                                    <select value={paymentMethodId}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            console.log("Selected value:", value);
                                            setPaymentMethodId(value);
                                        }}
                                        className="form-select" aria-label="Default select example">
                                        <option value="0">Chọn phương thức thanh toán</option>
                                        {dataPaymentMethod && (
                                            dataPaymentMethod.map((item) => {
                                                if (item.paymentMethodId === 6 ||
                                                    item.paymentMethodId === 7 ||
                                                    item.paymentMethodId === 3 ||
                                                    item.paymentMethodId === 4 ||
                                                    item.paymentMethodId === 8) {
                                                    return null;
                                                } else {
                                                    return (
                                                        <option key={item.paymentMethodId} value={item.paymentMethodId}>{item.name}</option>
                                                    )
                                                }
                                            })
                                        )}
                                    </select>
                                    <label>Phương thức thanh toán <b className="text-danger">*</b></label>
                                </div>
                            }
                            <b>Giá:</b> <b className="text-danger mb-3">{accountPackageTemporary?.price == 0 ? 'Miễn phí' : accountPackageTemporary?.price.toLocaleString() + " đ"} </b><br />
                            <b className="me-2">Hạn sử dụng:</b>
                            {accountPackageTemporary && accountPackageTemporary.price === 0 ? (
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

                    </Row>
                }
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-around">
                {!page && (
                    <><Button onClick={() => setPage(true)} className="btn btn-primary">Quay lại</Button>
                        <Button onClick={() => handleSubmit()} className="btn btn-danger">Thanh toán</Button></>
                )}
                <Button onClick={() => {
                    setShowCreateOwnerModal(false), setTimeout(() => {
                        setPage(true)
                    }, 500);
                }} className="btn btn-secondary">Hủy</Button>
            </Modal.Footer>
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