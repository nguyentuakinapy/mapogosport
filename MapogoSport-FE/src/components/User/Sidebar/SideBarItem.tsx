'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import SidebarDropdown from "./SideBarDropdown";

type MenuItem = {
    label: string;
    route: string;
    children?: MenuItem[];
};

interface SidebarItemProps {
    item: MenuItem;
    pageName: string;
    setPageName: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarItem = ({ item, pageName, setPageName }: SidebarItemProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const isActive = pageName === item.label.toLowerCase();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();  // Ngăn chặn việc thay đổi route khi click vào các mục có children
        setPageName(isActive ? "" : item.label.toLowerCase());
    };

    return (
        <ListGroup.Item>
            <Link href={item.route} onClick={handleClick}
                className={`${isClient && isActive ? "text-danger" : "text-dark"} d-flex fw-bold py-3 text-decoration-none`}>
                {item.label}
                {item.children && isClient && (
                    <span className={`ms-auto ${isActive ? "" : "rotate-180"}`}>
                        <i className={`bi ${isActive ? "bi-chevron-down" : "bi-chevron-up"}`}></i>
                    </span>
                )}
            </Link>
            {item.children && isClient && isActive && (
                <SidebarDropdown item={item.children} />
            )}
        </ListGroup.Item>
    );
};

export default SidebarItem;
