interface User {
    username: string;
    fullname: string;
    password: string;
    enabled: boolean;
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
