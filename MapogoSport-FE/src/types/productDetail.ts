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