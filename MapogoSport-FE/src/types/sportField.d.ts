interface SportField {
    sportFieldId: number;
    name: string;
    address: string;
    opening: string;
    closing: string;
    categoriesField: {
        categoriesFieldId: number;
        name: string;
        image: string;
    };
    quantity: number;
    status: string;
    image: string;
    owner: {
        ownerId: number;
        user: User;
        bankAccount: string;
        momoAccount: string;
        vnpayAccount: string;
    }
    decription: string;
    sportFielDetails: SportFieldDetail[];
}

interface SportFieldDetail {
    sportFielDetailId: number;
    name: string;
    price: number;
    peakHourPrices: number;
    size: string;
    status: string;
    percentDeposit: number;
    peakHour: string;
    availableTimes: string[];
}