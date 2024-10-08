interface Product {
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
}
