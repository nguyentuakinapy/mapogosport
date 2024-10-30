'use client'
import { formatPrice } from "@/components/Utils/Format";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Nav, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

export default function Owner({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<string>('all');

    const [userData, setUserData] = useState<User | null>(null);
    const [accountPackages, setAccountPackages] = useState<AccountPackage[]>();
    const [userSubscription, setUserSubscription] = useState<UserSubscription>();
    const [usernameFetchApi, setUsernameFetchApi] = useState<string>('');

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [gender, setGender] = useState<number | null>(null);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsernameFetchApi(`http://localhost:8080/rest/user/${parsedUserData.username}`);
        }
    }, []);

    const { data: dataUser, error: errorUser, isLoading: isLoadingUser } = useSWR(usernameFetchApi, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (dataUser) {
            setFullName(dataUser.fullname);
            setEmail(dataUser.email);
            setBirthday(dataUser.birthday ? new Date(dataUser.birthday) : null);
            setGender(dataUser.gender);
            setUserData(dataUser);
        }
        console.log(dataUser);

    }, [dataUser]);

    useEffect(() => {
        getOwner();
    }, [])

    const [owner, setOwner] = useState<Owner>();

    const getOwner = async () => {
        const user = sessionStorage.getItem('user');

        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            const responseOwner = await fetch(`http://localhost:8080/rest/owner/${parsedUserData.username}`);
            if (!responseOwner.ok) {
                throw new Error('Error fetching data');
            }
            const dataOwner = await responseOwner.json() as Owner;
            setOwner(dataOwner);
        }
    }

    const [dataSport, setDataSport] = useState<SportField[]>([])

    const { data: dataS, error: errorS, isLoading: isLoadingS } = useSWR(owner && `http://localhost:8080/rest/sport_field_by_owner/${owner.ownerId}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setDataSport(dataS);
    }, [dataS])


    const { data: ap, error: erAp, isLoading: isLoadingAp } = useSWR(
        `http://localhost:8080/rest/accountpackage`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setAccountPackages(ap);
    }, [ap])

    const { data: userSub, error: errorUserSub, isLoading: isLoadingUserSub } = useSWR(
        `http://localhost:8080/rest/user/subscription/${userData?.username}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        setUserSubscription(userSub);
    }, [userSub])

    const handleUpdateSubscription = (ap: AccountPackage) => {
        fetch(`http://localhost:8080/rest/user/subscription/${userSubscription?.userSubscriptionId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userSubscriptionId: userSubscription?.userSubscriptionId,
                accountPackageId: ap.accountPackageId
            }),
        }).then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                toast.error(`Cập nhật không thành công! Chi tiết lỗi: ${errorText}`);
                return
            }
            mutate(`http://localhost:8080/rest/user/subscription/${userData?.username}`);
            toast.success('Cập nhật thành công!');
        }).catch((error) => {
            toast.error(`Đã xảy ra lỗi: ${error.message}`);
        });
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return (
                    <div className="font-14">
                        <div style={{ fontSize: '14px' }}>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Floating className="mb-3">
                                        <Form.Control size="sm" type="text" placeholder="Họ và tên"
                                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                                        />
                                        <Form.Label>Họ và tên <b className='text-danger'>*</b></Form.Label>
                                    </Form.Floating>
                                </Form.Group>

                                <Row>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control size="sm" type="date" placeholder="Ngày sinh"
                                                />
                                                <Form.Label>Ngày sinh</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email:</Form.Label>
                                            <div>{userData?.email}<Link href="#" >(<i className="bi bi-pencil-square"></i> Cập nhật)</Link></div>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Giới tính">
                                                <Form.Select aria-label="Floating label select example"
                                                    value={gender != null ? gender.toString() : ''}
                                                    onChange={(e) => setGender(e.target.value === '0' ? 0 : e.target.value === '1' ? 1 : e.target.value === '2' ? 2 : null)}>
                                                    <option>-- Nhấn để chọn --</option>
                                                    <option value="0">Nam</option>
                                                    <option value="1">Nữ</option>
                                                    <option value="2">Khác</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Sổ địa chỉ</Form.Label>
                                            <div>
                                                Chưa có thông tin
                                                <Link href="#" >(<i className="bi bi-pencil-square"></i> Cập nhật)</Link>
                                            </div>

                                        </Form.Group>
                                    </Col>

                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control size="sm" type="text" placeholder="Ngày sinh"
                                                />
                                                <Form.Label>Bank Account</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>

                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control size="sm" type="text" placeholder="Ngày sinh"
                                                />
                                                <Form.Label>Momo Account</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control size="sm" type="text" placeholder="Ngày sinh"
                                                />
                                                <Form.Label>VNPay Account</Form.Label>
                                            </Form.Floating>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Link href={"#"} className='btn btn-profile' type="submit" >
                                    <i className="bi bi-floppy2"></i> Lưu
                                </Link>
                            </Form>
                        </div>
                    </div>
                );
            case 'deposit':
                return (
                    <div className="font-14">
                        chưa biết có gì bên trong
                    </div>
                );
            case 'withdraw':
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
                                        <b className="text-danger ms-3">{ap.price == 0 ? 'Miễn phí' : formatPrice(ap.price)}</b>
                                        {/* <Button className='btn-sub' onClick={() => handleUpdateSubscription(ap)} disabled={isOwned}>
                                            {isOwned ? "Đã sở hữu" : "Nâng cấp ngay"}
                                        </Button> */}
                                        {userSubscription && ap.accountPackageId <= userSubscription?.accountPackage?.accountPackageId ? (
                                            <Button className='btn-sub' onClick={() => handleUpdateSubscription(ap)} disabled={true}>
                                                Đã sở hữu
                                            </Button>
                                        ) : (
                                            <Button className='btn-sub' onClick={() => handleUpdateSubscription(ap)} disabled={isOwned}>
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
    if (!children) {
        return (
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
                            <Nav.Link eventKey="all" className="tab-link">Thông tin cá nhân</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="deposit" className="tab-link">Bài viết</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="withdraw" className="tab-link">Gói nâng cấp</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="mt-3">
                        {renderContent()}
                    </div>
                </div>
            </>
        )
    }
    return (

        <>{children}</>
    )

}