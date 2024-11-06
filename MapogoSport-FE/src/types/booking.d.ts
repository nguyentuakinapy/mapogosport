interface Booking {
    bookingId: number;
    date: Date;
    totalAmount: float;
    status: string;
    paymentMethod: {
        paymentMethodId: number;
        name: string;
        description: string;
    };
    owner: {
        ownerId: number;
        user: User;
        bankAccount: number;
        momoAccount: number;
        vnpayAccount: number;
    };
    voucher: {
        voucherId: number;
        name: string;
        discountPercent: number;
        quantity: number;
        createDate: Date;
        endDate: Date;
        status: status;
        discountCode: string;
        activeDate: string;
    };
    note: string;
    bookingPayments: bookingPayment[];
    bookingDetails: BookingDetail[];
    sportFieldInfo: {
        address: string;
        closing: string;
        name: string;
        sportFieldId: number;
        opening: string;
    };
}

interface bookingPayment {
    bookingPaymentId: number;
    amount: number;
    status: string;
    date: Date;
    user: User;
    referenceCode: null;
}

interface BookingDetail {
    bookingDetailId: number;
    startTime: string;
    endTime: string;
    sportFieldDetail: {
        sportFielDetailId: number;
        name: string;
        price: number;
        peakHourPrices: number;
        size: string;
        status: string;
        percentDeposit: number;
        peakHour: string;
    };
    price: number;
    date: string;
    subcriptionKey: string;
}


interface BookingDetailFullName {
    bookingDetailId: number;
    startTime: string;
    endTime: string;
    sportFieldDetail: {
        sportFielDetailId: number;
        name: string;
        price: number;
        peakHourPrices: number;
        size: string;
        status: string;
        percentDeposit: number;
        peakHour: string;
    };
    price: number;
    date: string;
    fullName: string
}

interface AvailableBooking {
    time: string;
    sportType: string;
    status: string;
    date: string;
    price: number;
    peakHourPrices: number;
    percentDeposit: number;
}

interface BookingByUserMap {
    bookingId: number;
    sportFieldName: string;
    totalAmount: number;
    status: string;
    date: Date;
}

interface BookingFindAll {
    bookingId: number;
    userFullname: string;
    userPhone: string;
    totalAmount: number;
    status: string;
    date: Date;
}