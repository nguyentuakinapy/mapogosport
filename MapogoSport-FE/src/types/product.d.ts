interface Product {
    productId: number;
    name: string;
    categoryProduct:{
        categoryProductId: number,
        name: string;
        imgae: string;
    };
    description: string;
    status: string;
    createDate: Date;
    brand: string;
    country: string;
    image: string;
    stock: double;
}


