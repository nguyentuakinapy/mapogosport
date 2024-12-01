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
    owner: Owner;
    decription: string;
    sportFielDetails: SportFieldDetail[];
    latitude: number;
    longitude: number;
    distance: number;
    fieldReviews: FieldReview[];
}

interface StatusSportFieldDetails {
    statusSportFieldDetailId: number
    startDate: date
    endDate: date
    statusName: date
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
    statusSportFieldDetails: StatusSportFieldDetails[];
}