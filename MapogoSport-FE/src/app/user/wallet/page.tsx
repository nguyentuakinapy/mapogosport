'use client'
import UserLayout from "@/components/User/UserLayout";
import '../types/user.scss';
import 'jspdf-autotable';
import Wallet from "@/components/User/modal/wallet";
import { Suspense } from "react";

const WalletPage = () => {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UserLayout>
                <Wallet></Wallet>
            </UserLayout>
        </Suspense>
    )
}

export default WalletPage;