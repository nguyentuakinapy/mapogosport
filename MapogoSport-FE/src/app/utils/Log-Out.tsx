const logOut = () => {
    localStorage.removeItem('username');
    sessionStorage.removeItem('user');
    window.location.href = "/";
}

export { logOut };
