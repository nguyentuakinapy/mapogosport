'use client'
import UserLayout from "@/components/User/UserLayout";
import '../types/user.scss';
import { Nav, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useData } from "@/app/context/UserContext";
import useSWR from "swr";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { RobotoBase64 } from "../../../../public/font/Roboto-Regular";
import { toast } from "react-toastify";
import Wallet from "@/components/User/modal/wallet";

const WalletPage = () => {

    return (
        <UserLayout>
            <Wallet></Wallet>
        </UserLayout>
    )
}

export default WalletPage;