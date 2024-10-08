interface SportField{
    sportFieldId: number
    name: string
    address: string
    opening: string
    closing: string
    quantity: number
    image: string
    status: string
    decription: string
    sportFielDetails: {
        sportFielDetailId: number
        name: string
        price: number
        peakHourPrices: number
        size: string
        status: string
        percentDeposit: number
        peakHour: string
    }
}