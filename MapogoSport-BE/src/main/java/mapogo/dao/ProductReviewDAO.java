package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.dto.ProductHaveReviewDTO;
import mapogo.entity.ProductReview;

public interface ProductReviewDAO extends JpaRepository<ProductReview, Integer> {
	@Query("SELECT re " + "FROM ProductReview re " + "JOIN re.product p " + "JOIN re.user u "
			+ "WHERE p.productId = :productId")
	List<ProductReview> findReviewsByProductId(@Param("productId") int productId);

	List<ProductReview> findByUser_Username(String username);

	@Query("SELECT re FROM ProductReview re JOIN re.product p where  p.productId = :productId AND re.rating = :rating")
	List<ProductReview> FindReviewByRating(@Param("productId") Integer productId, @Param("rating") Integer rating);

	@Query("SELECT new mapogo.dto.ProductHaveReviewDTO(p.productId, AVG(re.rating), COUNT(re.rating)) " +
		       "FROM ProductReview re " +
		       "JOIN re.product p " +
		       "GROUP BY p.productId")
		List<ProductHaveReviewDTO> getProductRatings();


}
