'use client'
import HomeLayout from '@/components/HomeLayout';
import { decodeString } from '@/components/Utils/Format';
import Image from 'next/image';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const PageVoucher = () => {
    const [voucher, setVoucher] = useState<Voucher[]>([])
    const [receivedVoucher, setReceivedVoucher] = useState<UserVoucherReceived[]>([])
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    
   
    useEffect(() => {

        handelReceivedVoucher()
        fetchDataVoucher()
    }, [])

    const handelSubmitGetVoucher = async (voucherId: number) => {

        const usernameLocal = localStorage.getItem("username")
        const username = usernameLocal ? decodeString(usernameLocal) : null;
        if (!username) {
            toast.warning("Bạn chưa đăng nhập!");
            return;
        }

        const checkResponse = await fetch(`${BASE_URL}rest/userVoucher/check/${username}/${voucherId}`);
        const alreadyHasVoucher = await checkResponse.json();

        if (alreadyHasVoucher) {
            toast.warning("Bạn đã nhận Voucher này rồi!");
            return;
        }
        const UserVoucher = {
            user: {
                username: username,
            },
            voucher: {
                voucherId: voucherId
            },
            status: 'Đang còn hạn',
            date: new Date(),
        };


        try {
            await fetch(`${BASE_URL}rest/userVoucher/create/${UserVoucher.voucher.voucherId}/${username}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchDataVoucher();
            toast.success("Nhận Voucher giá thành công!");
        } catch (error) {
            console.error("Lỗi khi nhận Voucher:", error);
            alert("Có lỗi xảy ra khi nhận Voucher. Vui lòng thử lại sau.");
        }
    };

    //Fetch findAll voucher

    const fetchDataVoucher = async () => {
        try {
            const response = await fetch(`${BASE_URL}rest/voucher/findAll`);
            const data = await response.json();
            setVoucher(data);
        } catch (error) {
            console.log("Error fetch voucher data", error)
        }
    }
     
    const handelReceivedVoucher = async()=>{
        const usernameLocal = localStorage.getItem("username")
        const username = usernameLocal ? decodeString(usernameLocal) : null;
        try {
            const response = await fetch(`${BASE_URL}rest/user/voucher/${username}`)
            const data = await response.json();
            console.log("Voucher user received: ",data)
            setReceivedVoucher(data)
           
        } catch (error) {
            console.error("Error handelReceived Voucher",error);
        }
    }
    //Handel select voucher khi active
    const filterVouchers = (vouchers: Voucher[]) => {
        const currentTime = new Date().getTime();
        const statusactive = 'active'
        return vouchers.filter(voucher => {
            const activeTime = new Date(voucher.activeDate).getTime();
            const endTime = new Date(voucher.endDate).getTime();
            return (currentTime >= activeTime && currentTime <= endTime) && (voucher.status === statusactive);
        });
    };

    const filteredVouchers = filterVouchers(voucher);

    const hasReceivedVoucher = (voucherId: number) => {
        return receivedVoucher.some(v=> v.voucher.voucherId===voucherId);
    }

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <HomeLayout>
                <div className="container my-5">
                    <div className="voucher-container">
                        <div className="row align-items-center justify-content-between voucher-banner">
                            <div className="col-md-8">
                                <Image width={829} height={207} src="/images/bannervoucher.svg" alt="Voucher Banner" />
                            </div>
                            <div className="col-md-4 text-center">
                                <Image width={250} height={250} src="/images/QRFB.png" alt="QR Code" />
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
                                            onClick={() => {
                                                handelSubmitGetVoucher(voucher.voucherId)
                                            }
                                            }
                                            disabled={voucher.quantity === 0||hasReceivedVoucher(voucher.voucherId)}
                                        >  {hasReceivedVoucher(voucher.voucherId) ? "Đã nhận" : "Nhận"} </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <Image width={1024} height={1793} src="/images/stepGetVoucher.webp" alt="Hướng dẫn sử dụng" />
                        </div>
                    </div>
                </div>
            </HomeLayout>
        </Suspense>
    )
}
export default PageVoucher;