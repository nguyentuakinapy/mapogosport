interface User {
    username: string;
    fullname: string;
    password: string;
    enabled: number;
    createdAt: Date;
    authorities: [
        {
            authorityId: number;
            role: {
                roleId: number;
                name: string;
            }
        }
    ];
}
