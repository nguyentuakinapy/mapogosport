// src/app/payment/page.tsx
'use client';

import { useState } from 'react';

export default function PaymentPage() {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        // Gửi yêu cầu thanh toán tới API Next.js
        const response = await fetch('/api/create-momo-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 50000 }),  // Số tiền cần thanh toán
        });

        const result = await response.json();
        console.log(result);

        // Nếu MoMo trả về URL thanh toán, điều hướng người dùng tới đó
        if (result.payUrl) {
            window.location.href = result.payUrl;
        } else {
            console.error('Thanh toán thất bại');

        }

        setLoading(false);
    };

    return (
        <div>
            <h1>Thanh toán qua MoMo</h1>
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Thanh toán qua MoMo'}
            </button>
        </div>
    );
}
