package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.ProductDetail;

public interface ProductDetailService {
	List<ProductDetail> findAll();
	
	List<ProductDetail> findById(Integer id); // Sửa lại tên phương thức
}
