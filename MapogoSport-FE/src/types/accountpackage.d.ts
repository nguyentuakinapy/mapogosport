interface AccountPackage {
    accountPackageId: number
    packageName: string
    price: number
    durationDays: number
    limitSportFields: number
    limitBookings: number
    accountPackageBenefits: AccountPackageBenefit[]
}

interface AccountPackageBenefit {
    accountPackageBenefitId: number
    benefit: Benefit
}

interface Benefit {
    benefitId: number
    description: string
}


