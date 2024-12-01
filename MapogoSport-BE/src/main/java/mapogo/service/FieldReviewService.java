package mapogo.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import mapogo.dto.FieldReviewDTO;
import mapogo.entity.FieldReview;

public interface FieldReviewService {
	List<Map<String, Object>> findByUser_Username(String username);
	void deleteReviewByUser(Integer fieldReviewId);
	List<FieldReview> findBySportField_SportFieldId(Integer id);
	List<FieldReview> findReviewByRating(Integer productId, Integer rating);
//	FieldReview createReview ( FieldReview review);
	FieldReview createReview(FieldReviewDTO reviewDto);
	Optional<FieldReview>findBySportField_SportFieldIdAndUser_Username(Integer fieldId, String username);
	
}
