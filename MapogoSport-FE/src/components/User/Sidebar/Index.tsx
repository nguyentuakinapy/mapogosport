'use client'
import '../types/user.scss'
import useLocalStorage from "../useLocalStorage";
import SidebarItem from "./SideBarItem";

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
                label: "Yêu thích",
                route: "#",
                children: [
                    { label: "Sân yêu thích", route: "/user/wishlist/sportfield" },
                    { label: "Sản phẩm yêu thích", route: "/user/wishlist/product" },
                    { label: "Bình luận và đánh giá", route: "/user/wishlist/comment" },
                ],
            },
            {
                label: "Ví và mã giảm giá",
                route: "#",
                children: [
                    { label: "Ví của bạn", route: "#" },
                    { label: "Phiếu giảm giá", route: "#" },
                ],
            },
        ],
    },
];

const Sidebar = () => {
    const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

    return (
        <>
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
        </>
    )
}

export default Sidebar;