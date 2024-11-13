package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.dto.FieldReviewDTO;
import mapogo.entity.FieldReview;
import mapogo.entity.ProductReview;

public interface FieldReviewService {
	List<FieldReview> findByUser_Username(String username);
	void deleteReviewByUser(Integer fieldReviewId);
	List<FieldReview> findBySportField_SportFieldId(Integer id);
	List<FieldReview> findReviewByRating(Integer productId, Integer rating);
//	FieldReview createReview ( FieldReview review);
	FieldReview createReview(FieldReviewDTO reviewDto);
	Optional<FieldReview>findBySportField_SportFieldIdAndUser_Username(Integer fieldId, String username);
	
}
