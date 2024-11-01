interface Review {

    productReviewId: number,
    user: {
        username: string,
        fullname: string,
        password: string,
        enabled: boolean,
        createdAt: Date,
        gender: number,
        birthday: Date,
        email: string,
        avatar: string,
        authorities: [
            {
                authorityId: number,
                role: {
                    roleId: number,
                    name: string
                }
            }
        ],
        addressUsers: []
    },
    rating: number,
    comment: string,
    datedAt: string
}

