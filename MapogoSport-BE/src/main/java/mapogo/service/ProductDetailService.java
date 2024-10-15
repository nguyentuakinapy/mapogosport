package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.ProductDetail;
import mapogo.entity.ProductDetailSize;

public interface ProductDetailService {
	List<ProductDetail> findAll();
	
	List<ProductDetail> findById(Integer id); // Sửa lại tên phương thức
	
	List<Object[]> selectColorByProductId(Integer idProduct);
	
	List<ProductDetailSize> selectSizeByIdProductDetail(Integer productDetailId);
	
	Optional<Double> findPriceByProductDetailIdAndSizeId(Integer productDetailId, Integer sizeId);
	
	List<Object[]> findByImageDetailAndGalleryByIdProductDetail(Integer productDetailId);
	
}
