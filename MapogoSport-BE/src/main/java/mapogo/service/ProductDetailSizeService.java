package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.ProductDetailSize;

public interface ProductDetailSizeService {
	List<ProductDetailSize> findAll();
	ProductDetailSize create(ProductDetailSize productDetailSize);
	ProductDetailSize update(ProductDetailSize productDetailSize);
	void deleteById(Integer id);
	
	List<ProductDetailSize> findProductDetailSize_By_ProductDetailId(Integer id);
	
}
