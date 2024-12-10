interface UserVoucher {
        userVoucherId: number
        username: string
        voucherId: number
        status: string
        date: Date
        voucher: Voucher;
}

interface Voucher {
        voucherId: number
        name: string
        discountPercent: number
        quantity: number
        createDate: Date
        endDate: Date
        status: string
        discountCode: string
        activeDate: Date
        createdBy: User
}

interface UserVoucherReceived{
        date: Date
        userVoucherId: number
        voucher: Voucher
        status: string
}