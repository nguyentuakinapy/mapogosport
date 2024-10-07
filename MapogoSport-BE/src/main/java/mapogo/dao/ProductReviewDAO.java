package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.ProductReview;

public interface ProductReviewDAO extends JpaRepository<ProductReview, Integer>{
	@Query("SELECT re "
		     + "FROM ProductReview re "
		     + "JOIN re.product p "
		     + "JOIN re.user u "
		     + "WHERE p.productId = :productId")
		List<ProductReview> findReviewsByProductId(@Param("productId") int productId);
}
