import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";

const SidebarDropdown = ({ item }: any) => {
    const pathname = usePathname();

    return (
        <ul className="ps-0">
            {item.map((item: any, index: number) => (
                <ListGroup key={index}>
                    <Link
                        href={item.route}
                        className={`text-decoration-none rounded-2 px-3 py-2 transition-all ${pathname === item.route
                            ? "bg-secondary text-white"
                            : "text-secondary"
                            }`}
                    >
                        {item.label}
                    </Link>
                </ListGroup>
            ))}
        </ul>
    );
};

export default SidebarDropdown;
