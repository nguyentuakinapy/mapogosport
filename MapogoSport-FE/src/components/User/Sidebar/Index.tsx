'use client'
import { usePathname } from 'next/navigation';
import '../types/user.scss'
import useLocalStorage from "../useLocalStorage";
import SidebarItem from "./SideBarItem";
import { useEffect, useState } from 'react';
import { useData } from '@/app/context/UserContext';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

const menuGroups = [
    {
        menuItems: [
            {
                label: "Quản lý tài khoản",
                route: "#",
                children: [
                    { label: "Thông tin tài khoản", route: "/user" },
                    { label: "Địa chỉ", route: "/user/address" },
                    { label: "Đơn hàng của bạn", route: "/user/orders" },
                    { label: "Danh sách đặt sân", route: "/user/bookings" },
                ],
            },
            {
                label: "Bình luận và yêu thích",
                route: "#",
                children: [
                    { label: "Sân yêu thích", route: "/user/wishlist/sportfield" },
                    { label: "Bình luận và đánh giá", route: "/user/wishlist/comment" }
                ],
            },
            {
                label: "Ví và Phiếu giảm giá",
                route: "#",
                children: [
                    { label: "Ví của bạn", route: "/user/wallet" },
                    { label: "Phiếu giảm giá", route: "/user/coupon" }
                ],
            }
        ],
    },
];

const Sidebar = () => {
    const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
    const pathname = usePathname();
    const userData = useData();
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState<string | null>();

    useEffect(() => {
        const activeItem = menuGroups.flatMap(group => group.menuItems)
            .find(menuItem => menuItem.route === pathname || menuItem.children?.some(child => child.route === pathname));

        if (activeItem) {
            setPageName(activeItem.label.toLowerCase());
        }
    }, [pathname, setPageName]);

    useEffect(() => {
        if (userData) {
            setName(userData.fullname || '');
            setAvatar(userData.avatar ? userData.avatar : null);
        }
    }, [userData]);

    const handleAvatarChange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("avatar", file);
            try {
                const response = await fetch(`http://localhost:8080/rest/user/avatar/${userData?.username}`, {
                    method: 'POST',
                    body: formData,
                });
                if (!response) {
                    toast.error(`Thêm ảnh không thành công! Vui lòng thử lại sau!`);
                    return;
                }
                const newAvatarUrl = await response.text();
                setAvatar(newAvatarUrl);
                toast.success("Thêm ảnh thành công!");
                mutate(`http://localhost:8080/rest/user/avatar/${userData?.username}`);
            } catch (error) {
                console.error("Thêm ảnh không thành công: ", error);
            }
        }
    };

    return (
        <div className="menu-user" style={{ height: '100%' }}>
            <div className="text-center">
                <div className="avatar-upload">
                    <div className="avatar-edit">
                        <input type="file" id="imageUpload" accept="image/*" onChange={handleAvatarChange} />
                        <label htmlFor="imageUpload" className="btn btn-link"> Sửa </label>
                    </div>
                    <div className="avatar-preview">
                        <div style={userData?.avatar ? { backgroundImage: `url(${avatar})` } : { backgroundImage: `url("/images/avatar-init.gif")` }}></div>
                    </div>
                </div>
                <div className="text-dark fw-bold mb-3">{name}</div>
            </div>
            {/* Sidebar Menu */}
            {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                    {group.menuItems.map((menuItem, menuIndex) => (
                        <SidebarItem key={menuIndex} item={menuItem} pageName={pageName} setPageName={setPageName} />
                    ))}
                </div>
            ))}
            {/* Sidebar Menu */}
        </div>
    );
}

export default Sidebar;