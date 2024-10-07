interface User {
    username: string;
    fullname: string;
    password: string;
    enabled: number;
    gender: boolean;
    createdAt: Date;
    birthday: Date;
    email: string;
    image: string;

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

interface User1 {
    username: string;
    fullname: string;
    password: string;
    enabled: number;
    gender: boolean;
    createdAt: Date;
    birthday: Date;
    email: string;
    image: string;
}
