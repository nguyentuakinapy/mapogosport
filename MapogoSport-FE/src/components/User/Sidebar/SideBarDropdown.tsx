import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";
import { mutate } from "swr";

const SidebarDropdown = ({ item, username }: any) => {
    const pathname = usePathname();

    const handleClick = () => {
        if (username) {
            mutate(`http://localhost:8080/rest/user/${username}`);
            mutate(`http://localhost:8080/rest/user/voucher/${username}`);
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
