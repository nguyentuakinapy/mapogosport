interface ProductDetail {
  productDetailId: number;
  color: string;
  image: string;
  galleries: Gallery[];
  product: Product;
  productDetailSizes: ProductDetailSize[]
}


interface ProductDetailAndDetailSize {
  name: string;
  color: string;
  productDetailId: number;
  detailSizes: DetailSize[]
  galleries: Gallery[];
  image: string;
  product: Product;
}

interface DetailSize {
  quantity: number
  size: string
  price: number
  detailSizeId: number
}