'use client'
import React, { useEffect, useState } from 'react';


const PageVoucher = () => {
    const [voucher,setVoucher] = useState<Voucher[]>([])

    //Fetch findAll voucher

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const response = await fetch(`http://localhost:8080/rest/voucher/findAll`);
                const data = await response.json();
                setVoucher(data);
                console.log("Voucher",data)
            } catch (error) {
                console.log("Error fetch voucher data",error)
            }
        }
        fetchData()
    },[])

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
    console.log("hiển thị những voucher filter",filteredVouchers)
    return(
        <div className="container my-5">
        <div className="voucher-container">
            <div className="row align-items-center justify-content-between voucher-banner">
                <div className="col-md-8">
                    <img src="/images/bannervoucher.svg" alt="Voucher Banner" className="img-fluid" />
                </div>
                <div className="col-md-4 text-center">
                    <img src="/images/qrcode.png" alt="QR Code" className="img-fluid" style={{ maxHeight: '250px' }} />
                </div>
            </div>
            <div>
                <h2 className="fw-bold voucher-title"><i className="bi bi-ticket-perforated"></i> Mã giảm giá</h2>
            </div>
            <div className="card-voucher d-flex flex-wrap justify-content-between align-items-center p-3 border rounded  ">
                <div className="voucher-item d-flex col-4 col-md-4 p-2 mb-4">
                    <div className="voucher-info text-center col-4 border-end">
                        <div className="circle">
                            <span className="brand-name">Mapogo</span>
                        </div>
                    </div>
                    <div className="voucher-discount text-center col-6 ">
                        <span className="discount">Giảm giá 20%ggggdddddddddddggggg</span>
                        <span className="expiry">HSD: 20/10/2024</span>
                    </div>
                    <div className="get col-2 text-center ">
                        <button type="button" className="btn btn-dark text-center ">Nhận</button>
                    </div>
                </div>
               
            </div>
            {/* <div className="text-center mt-3">
                <div className="step">
                    <h1>Các bước nhận mã giảm giá</h1>
                </div>
                <img src="/img/DALL·E 2024-11-06 11.41.54 - A clean, minimalistic banner in black and white colors, showcasing a step-by-step guide on how to find and use discount vouchers in an online shopping.webp" alt="" />
            </div> */}
        </div>
    </div>
    )
}
export default PageVoucher;