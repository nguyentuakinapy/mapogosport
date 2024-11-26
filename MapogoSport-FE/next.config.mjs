/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vnpay.vn',
                pathname: '/**', // Cho phép tất cả đường dẫn trên hostname này
            },
            {
                protocol: 'https',
                hostname: 'developers.momo.vn',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
