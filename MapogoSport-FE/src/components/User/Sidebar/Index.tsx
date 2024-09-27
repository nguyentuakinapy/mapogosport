'use client'
import { usePathname } from 'next/navigation';
import '../types/user.scss'
import useLocalStorage from "../useLocalStorage";
import SidebarItem from "./SideBarItem";
import { useEffect } from 'react';

const menuGroups = [
    {
        menuItems: [
            {
                label: "Quản lý tài khoản",
                route: "#",
                children: [
                    { label: "Thông tin tài khoản", route: "/user/profile" },
                    { label: "Địa chỉ", route: "/user/address" },
                    { label: "Đơn hàng của bạn", route: "/user/orders" },
                    { label: "Danh sách đặt sân", route: "/user/bookings" },
                ],
            },
            {
                label: "Yêu thích và voucher",
                route: "#",
                children: [
                    { label: "Sân yêu thích", route: "/user/wishlist/sportfield" },
                    { label: "Sản phẩm yêu thích", route: "/user/wishlist/product" },
                    { label: "Bình luận và đánh giá", route: "/user/wishlist/comment" },
                    { label: "Phiếu giảm giá", route: "/user/coupon" }
                ],
            }
        ],
    },
];

const Sidebar = () => {
    const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
    const pathname = usePathname();

    useEffect(() => {
        const activeItem = menuGroups.flatMap(group => group.menuItems)
            .find(menuItem => menuItem.route === pathname || menuItem.children?.some(child => child.route === pathname));

        if (activeItem) {
            setPageName(activeItem.label.toLowerCase());
        }
    }, [pathname, setPageName]);

    return (
        <div className="menu-user">
            <div className="text-center">
                <div className="avatar-upload">
                    <div className="avatar-edit">
                        <input type="file" name="avatar" id="imageUpload"
                            accept="image/jpeg, image/png" style={{ display: 'none' }} />
                        <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                    </div>

                    <div className="avatar-preview">
                        <div style={{ backgroundImage: `url("/images/avatar-init.gif")` }}></div>
                    </div>
                </div>
                <div className="text-dark fw-bold mb-3">Nguyễn Phi Hùng</div>
            </div>
            {/* Sidebar Menu */}
            {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                    {group.menuItems.map((menuItem, menuIndex) => (
                        <SidebarItem
                            key={menuIndex}
                            item={menuItem}
                            pageName={pageName}
                            setPageName={setPageName}
                        />
                    ))}
                </div>
            ))}
            {/* Sidebar Menu */}
        </div>
    );
}

export default Sidebar;