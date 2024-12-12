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
    voucher: Voucher;
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
            galleries: Galleries[];
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

interface OrderDetailMap {
    productImage: string;
    quantity: number;
    productId: number;
    productColor: string;
    orderDetailId: number;
    productName: string;
    productPrice: number;
}

interface OrderInfo {
    address: string;
    phoneNumber: string;
    fullname: string;
    status: string;
    note: string;
    paymentMethodName: string;
}