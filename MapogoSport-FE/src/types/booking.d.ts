interface Booking {
    bookingId: number;
    date: Date;
    totalAmount: float;
    percentDeposit: float;
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
    fullName: string;
    phoneNumber: string;
    percentDeposit: number;
    oldTotalAmount: number;
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
    sportFieldDetail: SportFieldDetail;
    price: number;
    date: string;
    subscriptionKey: string;
    status: boolean;

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
        statusSportFieldDetails: StatusSportFieldDetails[];
    };
    price: number;
    date: string;
    status: string;
    fullName: string;
    phoneNumber: string;
    checkOffline: boolean;
    subscriptionKey: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    deposit: number;
    statusBooking: string;
    bookingId: number;
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
    bookingDetails: [
        {
            bookingDetailStatus: string;
            price: number;
            bookingDetailDate: Date;
            startTime: string;
        }
    ]
    sportFieldName: string;
    totalAmount: number;
    oldTotalAmount: number;
    status: string;
    date: Date;
    percentDeposit: number;
}

interface BookingFindAll {
    bookingId: number;
    sportFieldName: string;
    bookingUserFullname: string;
    bookingUserPhone: string;
    totalAmount: number;
    oldTotalAmount: number;
    percentDeposit: number;
    status: string;
    date: Date;
    user: {
        username: string;
        fullname: string;
    };
    bookingDetails: [
        {
            bookingDetailStatus: string;
            price: number;
            bookingDetailDate: Date;
            startTime: string;
        }
    ]
}

interface BookingDetailMap {
    bookingDetailId: number;
    date: string;
    sportFieldDetailName: string;
    startTime: string;
    endTime: string;
    price: number;
    status: string;
}

interface BookingMap {
    date: string;
    ownerPhoneNumber: string;
    userFullname: string;
    userPhoneNumber: string;
    sportFieldName: string;
    address: string;
    ownerFullname: string;
    statusBooking: string;
    bookingId: number;
    deposit: number;
    paymentMethodName: string;
}

interface BookingDetailPeriod {
    startTime: string;
    endTime: string;
    sportFieldDetailId: number;
    price: number;
    date: string;
    booking: number;
    subscriptionKey: string;
}