package mapogo.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;

import mapogo.entity.Product;
import mapogo.entity.ProductDetail;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.UserSubscription;

public interface ProductDetailService {
	List<ProductDetail> findAll();
	
	List<ProductDetail> findById(Integer id); // Sửa lại tên phương thức
	
	List<Object[]> selectColorByProductId(Integer idProduct);
	
	List<ProductDetailSize> selectSizeByIdProductDetail(Integer productDetailId);
	
	Optional<Double> findPriceByProductDetailIdAndSizeId(Integer productDetailId, Integer sizeId);
	
	List<Object[]> findByImageDetailAndGalleryByIdProductDetail(Integer productDetailId);

	Optional<ProductDetail> findByIdProduct(Integer id);// select productDetail by productId
	
	ProductDetail create(ProductDetail productDetail);
	ProductDetail update(ProductDetail productDetail);
	void delete(Integer id);
	
//	ProductDetail findProduct_Id_By_Product_Detail_Id( Integer productDetail_Id);
	
	ProductDetail updateProductDetailWithMap(Map<String, Object> data);

}
