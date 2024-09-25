'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import SidebarDropdown from "./SideBarDropdown";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleClick = () => {
        setPageName((prevPageName: string) =>
            prevPageName !== item.label.toLowerCase() ? item.label.toLowerCase() : ""
        );
    };

    return (
        <ListGroup.Item>
            <Link href={item.route} onClick={handleClick}
                className={`${isClient && pageName === item.label.toLowerCase() ? "text-danger" : "text-dark"} d-flex fw-bold py-3 text-decoration-none`}>
                {item.label}
                {item.children && isClient && (
                    <span className={`ms-auto ${pageName === item.label.toLowerCase() ? "" : "rotate-180"}`}>
                        <i className={`bi ${pageName === item.label.toLowerCase() ? "bi-chevron-down" : "bi-chevron-up"}`}></i>
                    </span>
                )}
            </Link>
            {item.children && isClient && (
                <div className={`${pageName !== item.label.toLowerCase() ? "d-none" : ""}`}>
                    <SidebarDropdown item={item.children} />
                </div>
            )}
        </ListGroup.Item>
    );
};

export default SidebarItem;
