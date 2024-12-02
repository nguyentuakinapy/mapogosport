import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";
import { mutate } from "swr";
import { useData } from "@/app/context/UserContext";

type MenuItem = {
    label: string;
    route: string;
    children?: MenuItem[];
};

interface SidebarDropdownProps {
    item: MenuItem[];
}

const SidebarDropdown = ({ item }: SidebarDropdownProps) => {
    const pathname = usePathname();
    const userData = useData();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleClick = () => {
        if (userData) {
            mutate(`${BASE_URL}rest/user/${userData.username}`);
            mutate(`${BASE_URL}rest/user/voucher/${userData.username}`);
            mutate(`${BASE_URL}rest/wallet/transaction/${userData.wallet.walletId}`)
        }
    }

    return (
        <ul className="ps-0">
            {item.map((child, index) => (
                <ListGroup key={index}>
                    <Link onClick={() => handleClick()} href={child.route} className={`text-decoration-none rounded-2 px-3 py-2 transition-all 
                    ${pathname === child.route ? "bg-secondary text-white" : "text-secondary"}`} >
                        {child.label}
                    </Link>
                </ListGroup>
            ))}
        </ul>
    );
};

export default SidebarDropdown;
