'use client'
import HomeLayout from '@/components/HomeLayout';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';


const PageVoucher = () => {
    const [voucher, setVoucher] = useState<Voucher[]>([])
    const [user, setUser] = useState<any>(null);


    const getUserSession = () => {
        const userSession = sessionStorage.getItem('user');
        setUser(userSession ? JSON.parse(userSession) : null);
    };

    useEffect(() => {
        // get user whenever user login
        getUserSession();

        // add  event listener to update user session whenever it changes
        const handleStorageChange = () => getUserSession();
        window.addEventListener('storage', handleStorageChange);

        // remove event listener on unmount
        return () => {
            window.removeEventListener('storage', getUserSession);
        };
    }, []);

    const handelSubmitGetVoucher = async (voucherId: number) => {

        getUserSession()

        if (!user || !user.username) {
            toast.warning("Bạn chưa đăng nhập!");
            return;
        }

        const checkResponse = await fetch(`http://localhost:8080/rest/userVoucher/check/${user.username}/${voucherId}`);
        const alreadyHasVoucher = await checkResponse.json();
        console.log("check", alreadyHasVoucher)

        if (alreadyHasVoucher) {
            toast.warning("Bạn đã nhận Voucher này rồi!");
            return;
        }

        console.log("user", user.UserVoucher)
        const UserVoucher = {
            user: {
                username: user.username,
            },
            voucher: {
                voucherId: voucherId
            },
            status: 'Đang còn hạn',
            date: new Date(),
        };


        try {
            const response = await fetch(`http://localhost:8080/rest/userVoucher/create/${UserVoucher.voucher.voucherId}/${localStorage.getItem("username")}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(UserVoucher),
            });

            // if (!response.ok) {
            //     const errorMessage = await response.text();
            //     throw new Error(`Có lỗi xảy ra khi nhận voucher: ${errorMessage}`);
            // }

            // const result = await response.json();
            fetchDataVoucher();
            toast.success("Nhận Voucher giá thành công!");


        } catch (error) {
            console.error("Lỗi khi nhận Voucher:", error);
            alert("Có lỗi xảy ra khi nhận Voucher. Vui lòng thử lại sau.");
        }
    };

    //Fetch findAll voucher

    useEffect(() => {

        fetchDataVoucher()
    }, [])

    const fetchDataVoucher = async () => {
        try {
            const response = await fetch(`http://localhost:8080/rest/voucher/findAll`);
            const data = await response.json();
            setVoucher(data);
            console.log("Voucher", data)
        } catch (error) {
            console.log("Error fetch voucher data", error)
        }
    }
    //Handel select voucher khi active
    const filterVouchers = (vouchers: Voucher[]) => {
        const currentTime = new Date().getTime();
        return vouchers.filter(voucher => {
            const activeTime = new Date(voucher.activeDate).getTime();
            const endTime = new Date(voucher.endDate).getTime();
            return currentTime >= activeTime && currentTime <= endTime;
        });
    };

    const filteredVouchers = filterVouchers(voucher);
    console.log("hiển thị những voucher filter", filteredVouchers)
    return (
        <HomeLayout>
            <div className="container my-5">
                <div className="voucher-container">
                    <div className="row align-items-center justify-content-between voucher-banner">
                        <div className="col-md-8">
                            <img src="/images/bannervoucher.svg" alt="Voucher Banner" className="img-fluid" />
                        </div>
                        <div className="col-md-4 text-center">
                            <img src="/images/QRFB.png" alt="QR Code" className="img-fluid" style={{ maxHeight: '250px' }} />
                        </div>
                    </div>
                    <div>
                        <h2 className="fw-bold voucher-title"><i className="bi bi-ticket-perforated"></i> Mã giảm giá</h2>
                    </div>
                    <div className="card-voucher d-flex flex-wrap justify-content-start align-items-center p-3 border rounded  ">
                        {filteredVouchers.map((voucher, index) => (
                            <div key={index} className="voucher-item d-flex col-4 col-md-4 p-2 mb-4">
                                <div className="voucher-info text-center col-4 border-end">
                                    <div className="circle">
                                        <span className="brand-name">Mapogo</span>
                                    </div>
                                </div>
                                <div className="voucher-discount text-center col-6 ">
                                    <span className="discount">Giảm giá {voucher.discountPercent} %</span>
                                    <span className="expiry">HSD: {new Date(voucher.endDate).toLocaleDateString('en-GB')}</span> <br />
                                    <em className='text-secondary' style={{ fontSize: "12px" }}>Số lượng: {voucher.quantity}</em>
                                </div>
                                <div className="get col-2 text-center ">
                                    <button type="button" className="btn btn-dark text-center "
                                        onClick={() => handelSubmitGetVoucher(voucher.voucherId)}
                                        disabled={voucher.quantity === 0}
                                    >Nhận</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-3">
                        <img src="/images/stepGetVoucher.webp" alt="" />
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}
export default PageVoucher;