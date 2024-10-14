import Time from "react-datepicker/dist/time"

interface Booking {
    bookingId: number
    date: Date
    user: {
        username: string
        fullname: string
        password: string
        enabled: string
        createdAt: string
        gender: number | null;
        createdAt: Date;
        birthday: Date | null;
        email: string
        avatar: string | null;
        authorities: [
            {
                authorityId: number;
                role: {
                    roleId: number;
                    name: string;
                }
            }
        ]
    }
    totalAmount: float
    status: number
    paymentMethod: {
        paymentMethodId: number
        name: string
        description: string
    }
    owner: {
        ownerId: number
        user: {
            username: string
            fullname: string
            password: string
            enabled: string
            createdAt: string
            gender: number | null;
            createdAt: Date;
            birthday: Date | null;
            email: string
            avatar: string | null;
            authorities: [
                {
                    authorityId: number;
                    role: {
                        roleId: number;
                        name: string;
                    }
                }
            ]
        }
        bankAccount: number
        momoAccount: number
        vnpayAccount: number
    }
    voucher: {
        voucherId: number
        name: string
        discountPercent: number
        quantity: number
        createDate: Date
        endDate: Date
        status: status
        discountCode: string
        activeDate: string
    }
    note: string
    bookingPayments: [
    ]
    bookingDetails: [
        {
            bookingId: number
            startTime: Time
            endTime: Time
            sportFieldDetail: {
                sportFielDetailId: number
                name: string
                price: float
                peakHourPrices: float
                size: number
                status: number
                percentDeposit: number
                peakHour: string
            }
            price: float
        }
    ]
}