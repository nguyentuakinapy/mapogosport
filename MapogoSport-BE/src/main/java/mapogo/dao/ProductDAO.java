package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.Product;
import mapogo.entity.ProductDetail;

public interface ProductDAO extends JpaRepository<Product, Integer>{
	
	  @Query("SELECT p FROM Product p ORDER BY p.productId DESC")
	    List<Product> findAllProductsFromBottom();
	
	  @Query("SELECT p.productId AS productId, p.name AS name, COALESCE(SUM(pds.quantity), 0) AS totalQuantity " +
		       "FROM Product p " +
		       "LEFT JOIN ProductDetail pd ON p.productId = pd.product.productId " +
		       "LEFT JOIN ProductDetailSize pds ON pd.productDetailId = pds.productDetail.productDetailId " +
		       "GROUP BY p.productId, p.name " +
		       "ORDER BY p.productId")
		List<Object[]> getProductQuantitySummary();
		
		   @Query("SELECT SUM(pds.quantity) FROM ProductDetailSize pds JOIN pds.productDetail pd WHERE pd.product.productId = :productId")
		    Integer getTotalQuantityByProductId(@Param("productId") Integer productId);

}
