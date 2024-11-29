interface Ward {
    Id: string;
    Name: string;
    Level: string;
}

interface District {
    Id: string;
    Name: string;
    Wards: Ward[];
}

interface Province {
    Id: string;
    Name: string;
    Districts: District[];
}

type ApiAddressResponse = Province[];

