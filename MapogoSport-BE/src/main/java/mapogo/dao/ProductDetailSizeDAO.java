package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.ProductDetailSize;

public interface ProductDetailSizeDAO extends JpaRepository<ProductDetailSize, Integer>{
	  @Query("SELECT pds FROM ProductDetailSize pds WHERE pds.productDetail.id = :productDetailId")
	    List<ProductDetailSize> findByProductDetailId(@Param("productDetailId") Integer productDetailId);
}
