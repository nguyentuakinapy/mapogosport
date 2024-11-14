package mapogo.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.FieldReview;
import mapogo.entity.ProductReview;

public interface FieldReviewDAO extends JpaRepository<FieldReview, Integer>{
	List<FieldReview> findByUser_Username(String username);
	List<FieldReview> findBySportField_SportFieldId(Integer id);

	@Query("SELECT f FROM FieldReview f JOIN f.sportField s where  s.sportFieldId = :sportFieldId AND f.rating = :rating")
	List<FieldReview> FindReviewByRating(@Param("sportFieldId") Integer productId, @Param("rating") Integer rating);
   
	Optional<FieldReview> findBySportField_SportFieldIdAndUser_Username(Integer fieldId, String username);


}
