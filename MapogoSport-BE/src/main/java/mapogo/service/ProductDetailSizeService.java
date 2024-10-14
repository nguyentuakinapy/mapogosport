package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.ProductDetailSize;

public interface ProductDetailSizeService {
	List<ProductDetailSize> findAll();
	Optional<ProductDetailSize> findById(Integer id);
	ProductDetailSize create(ProductDetailSize productDetailSize);
	ProductDetailSize update(ProductDetailSize productDetailSize);
	void deleteById(Integer id);
}
