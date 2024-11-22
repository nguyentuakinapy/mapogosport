'use client'
import UserLayout from "@/components/User/UserLayout";
import '../types/user.scss';
import 'jspdf-autotable';
import Wallet from "@/components/User/modal/wallet";

const WalletPage = () => {
    return (
        <UserLayout>
            <Wallet></Wallet>
        </UserLayout>
    )
}

export default WalletPage;