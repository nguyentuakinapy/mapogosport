interface ProductDetail {
    productDetailId: number 
    color: string;
    image: string;
    galleries: [
        {
            galleryId: number;
            name: string;
        }
    ]

}