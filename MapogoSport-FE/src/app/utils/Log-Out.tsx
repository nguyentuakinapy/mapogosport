import Cookies from 'js-cookie';

const logOut = async () => {
    try {
        // Gọi API để xóa cookie sessionDataAuth
        const response = await fetch('/api/logout', {
            method: 'DELETE',
        });

        if (response.ok) {
            // Xóa dữ liệu trong localStorage và sessionStorage
            localStorage.removeItem('username');
            sessionStorage.removeItem('user');
            Cookies.remove('sessionDataAuth'); // Dành cho cookie không có HttpOnly

            // Chuyển hướng về trang chủ
            window.location.href = "/";
        } else {
            console.error("Failed to log out");
        }
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

export { logOut };

