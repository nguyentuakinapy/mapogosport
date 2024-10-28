interface Product {
    filter(arg0: (_: any, idx: any) => boolean): unknown;
    productId: number;
    name: string;
    categoryProduct: CategoryProduct;
    description: string;
    status: string;
    createDate: Date;
    brand: string;
    country: string;
    price: number;
    image:  File | string;
    stock: double;
}




