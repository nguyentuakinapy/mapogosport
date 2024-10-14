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
    // image: string;
    image:  File | string;
    stock: number;
    price: number
}
// HuuThanh