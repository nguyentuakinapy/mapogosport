import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";
import { mutate } from "swr";
import { useData } from "@/app/context/UserContext";

const SidebarDropdown = ({ item, user }: any) => {
    const pathname = usePathname();
    const userData = useData();

    const handleClick = () => {
        if (userData) {
            mutate(`http://localhost:8080/rest/user/${userData.username}`);
            mutate(`http://localhost:8080/rest/user/voucher/${userData.username}`);
            mutate(`http://localhost:8080/rest/wallet/transaction/${userData.wallet.walletId}`)
        }
    }

    return (
        <ul className="ps-0">
            {item.map((child: any, index: number) => (
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
