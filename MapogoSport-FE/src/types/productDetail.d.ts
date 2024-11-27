interface ProductDetail {
  productDetailId: number;
  color: string;
  image: string;
  galleries: Gallery[];
  product: Product;
  productDetailSizes: ProductDetailSize[]
}
z