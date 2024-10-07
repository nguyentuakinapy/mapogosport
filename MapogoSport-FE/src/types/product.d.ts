interface Product {
<<<<<<< HEAD
    productId: number;
    name: string;
    price: double;
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
    productDetails: [
        {
            productDetailId: number 
            color: string;
            size: number;
            quantity: double;
            image: string;
            galleries: [
                {
                    galleryId: number;
                    name: string;
                }
            ]
    }]
}

interface ProductDetail {
    productDetailId: number 
    color: string;
    size: string;
    quantity: number;
    image: string;
    galleries: [
        {
            galleryId: number;
            name: string;
        }
    ]
=======
    productId: number
    name: string
    price: number
    description: string
    status: string
    createDate: Date
    brand: string
    country: string
    image: string
    stock: number
>>>>>>> 695ed675d69c9699b1b514de646972edabe2eda3
}