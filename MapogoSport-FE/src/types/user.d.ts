interface User {
    username: string;
    fullname: string;
    password: string;
    enabled: number;
    gender: number | null;
    createdAt: Date;
    birthday: Date | null;
    email: string;
    image: string | null;
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
