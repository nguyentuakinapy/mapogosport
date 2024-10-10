package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.ProductDetail;

public interface ProductDetailDAO extends JpaRepository<ProductDetail, Integer>{
	
	@Query("SELECT o FROM ProductDetail o WHERE o.product.productId = ?1") // select by product Id
	List<ProductDetail> findByIdProduct(Integer id);
}
