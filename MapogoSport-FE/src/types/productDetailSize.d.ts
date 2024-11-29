interface ProductDetailSize {
  productDetailSizeId: number;
  productDetail: ProductDetail | { productDetailId: number };
  size: Size | {sizeId: number};
  price: number;
  quantity: number;
}