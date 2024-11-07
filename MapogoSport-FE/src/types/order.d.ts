interface Order {
    orderId: number;
    user: User;
    address: string;
    phoneNumber: string;
    date: Date;
    status: string;
    amount: number;
    paymentMethod: {
        paymentMethodId: number;
        name: string;
        description: string
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
    note: string | null;
    shipFee: number;
    orderDetails: OrderDetail[];
    //orderPayments: OrderPayment[];
}

interface OrderDetail {
    orderDetailId: number;
    productDetailSize: {
        productDetailSizeId: number;
        productDetail: {
            productDetailId: number;
            product: Product;
            color: string;
            image: string;
            //galleries: Galleries[]
        },
        size: {
            sizeId: number;
            sizeName: string;
        },
        price: number;
        quantity: number
    },
    quantity: number;
}

interface OrderMap {
    orderId: number;
    fullname: string;
    date: Date;
    amount: number;
    address: string;
    status: string;
    phoneNumber: string;
    productName: string;
}