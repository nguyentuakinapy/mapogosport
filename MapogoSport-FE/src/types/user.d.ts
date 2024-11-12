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
    phoneNumberUsers: [
        {
            phoneNumberUserId: number;
            phoneNumber: {
                phoneNumberId: number;
                phoneNumber: string;
            },
            active: boolean;
        }
    ]
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

interface NotificationUser {
    notificationId: number
    user: User
    title: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
    updatedAt: string
}