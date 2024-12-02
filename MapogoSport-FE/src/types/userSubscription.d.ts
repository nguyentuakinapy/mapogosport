export interface UserSubscription {
    userSubscriptionId: number;
    accountPackage: AccountPackage;
    user: User;
    startDay: string;
    endDay: string;
    status: string;
    subscriptionPayments: SubscriptionPayment[];
}

export interface AccountPackage {
    accountPackageId: number;
    packageName: string;
    price: number;
    durationDays: number;
    limitBookings: number;
    limitSportFields: number;
    status: string;
    accountPackageBenefits: AccountPackageBenefit[];
}

export interface AccountPackageBenefit {
    accountPackageBenefitId: number;
    benefit: Benefit;
}

export interface Benefit {
    benefitId: number;
    description: string;
}

export interface User {
    username: string;
    fullname: string;
    password: string;
    enabled: boolean;
    createdAt: string;
    gender: number;
    birthday: string;
    email: string;
    avatar: string;
    authorities: Authority[];
    addressUsers: AddressUser[];
    phoneNumberUsers: PhoneNumberUser[];
    wallet: Wallet;
}

export interface Authority {
    authorityId: number;
    role: Role;
}

export interface Role {
    roleId: number;
    name: string;
}

export interface AddressUser {
    addressUserId: number;
    address: Address;
    addressDetail: string;
    active: boolean;
}

export interface Address {
    addressId: number;
    province: string;
    district: string;
    ward: string;
}

export interface PhoneNumberUser {
    phoneNumberUserId: number;
    phoneNumber: PhoneNumber;
    active: boolean;
}

export interface PhoneNumber {
    phoneNumberId: number;
    phoneNumber: string;
}

export interface Wallet {
    walletId: number;
    balance: number;
}

export interface SubscriptionPayment {
    // Define fields if necessary, currently an empty array
}
