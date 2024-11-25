interface User {
    username: string;
    fullname: string;
    password: string;
    enabled: number;
    createdAt: Date;
    gender: number | null;
    birthday: Date | null;
    email: string;
    avatar: string | null;
    authorities: Authorities[];
    addressUsers: [
        {
            addressUserId: number;
            address: {
                addressId: number;
                province: string;
                district: string;
                ward: string;
            },
            addressDetail: string;
        }
    ];
    phoneNumberUsers: PhoneNumberUser[];
    wallet: {
        walletId: number;
        balance: number;
    }
}

interface PhoneNumberUser {
    phoneNumberUserId: number;
    phoneNumber: {
        phoneNumberId: number;
        phoneNumber: string;
    },
    active: boolean;
}

interface Authorities {
    authorityId: number;
    role: {
        roleId: number;
        name: string;
    }
}

interface UserSubscription {
    userSubscriptionId: number
    accountPackage: AccountPackage
    user: User
    startDay: string
    endDay: string
    status: string
    subscriptionPayments: SubscriptionPayments[]
}

interface SubscriptionPayments {

}

// interface NotificationUser {
//     notificationId: number
//     user: User
//     title: string
//     message: string
//     type: string
//     isRead: boolean
//     createdAt: string
//     updatedAt: string
//     booking: Booking
//     order: Order
// }

interface NotificationUser {
    notificationId: number
    title: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
    updatedAt: string
    bookingId: number
    orderId: number
    username: string
}

interface JwtGoogleAccount {
    aud: string
    azp: string
    email: string
    email_verified: boolean
    exp: number
    family_name: string
    given_name: string
    iat: number
    iss: string
    jti: number
    name: string
    nbf: number
    picture: string
    sub: number
}