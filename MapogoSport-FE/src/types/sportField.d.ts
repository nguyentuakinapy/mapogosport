// interface SportField {
//     sportFieldId: number
//     name: string
//     address: string
//     opening: string
//     closing: string
//     quantity: number
//     image: string
//     status: string
// }

interface SportField {
    sportFieldId: number
    name: string
    address: string
    opening: string
    closing: string
    categoriesField: {
        categoriesFieldId: number
        name: string
        image: string
    }
    quantity: number
    status: string
    image: string
    decription: string
    sportFielDetails: [
        {
            sportFielDetailId: number
            name: string
            price: float
            peakHourPrices: float
            size: string
            status: number
            percentDeposit: number
            peakHour: string
        }
    ]
}