interface BookingDetail {
  bookingDetailId: number
  startTime: string
  endTime: string
  sportFieldDetail: {
    sportFielDetailId: number
    name: string
    price: number
    peakHourPrices: number
    size: string
    status: string
    percentDeposit: number
    peakHour: string
  },
  price: number
  date: Date
}
