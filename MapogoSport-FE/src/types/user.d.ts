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
    authorities: [
        {
            authorityId: number;
            role: {
                roleId: number;
                name: string;
            }
        }
    ];
    addressUsers: [
        {
            addressUserId: number;
            address: {
                addressId: number;
                province: string;
                district: string;
                ward: string;
            },
            phoneNumber: string;
            addressDetail: string;
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