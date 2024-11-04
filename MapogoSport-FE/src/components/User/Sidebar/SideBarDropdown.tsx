import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";
import { mutate } from "swr";

const SidebarDropdown = ({ item }: any) => {
    const pathname = usePathname();

    const handleClick = () => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            mutate(`http://localhost:8080/rest/user/${parsedUserData.username}`)
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
