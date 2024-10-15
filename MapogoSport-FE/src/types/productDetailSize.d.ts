interface ProductDetailSize {
  productDetailSizeId: number;
  productDetail: {
    productDetailId: number;
    color: string;
    image: string;
    galleries: [
      {
        galleryId: number;
        name: string;
      }
    ];
  };
  size: {
    sizeId: number;
    sizeName: string;
  };
  price: number;
  quantity: number;
}
