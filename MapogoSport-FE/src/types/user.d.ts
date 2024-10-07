interface User {
    username: string;
    fullname: string;
    password: string;
    enabled: number;
    gender: boolean | null;
    createdAt: Date;
    birthday: Date | null;
    email: string;
<<<<<<< HEAD
    image: string | null;
=======
    image: string;

>>>>>>> 695ed675d69c9699b1b514de646972edabe2eda3
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
