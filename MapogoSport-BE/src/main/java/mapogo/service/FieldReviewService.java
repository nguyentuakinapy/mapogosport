package mapogo.service;

import java.util.List;

import mapogo.dto.FieldReviewDTO;
import mapogo.entity.FieldReview;

public interface FieldReviewService {
	List<FieldReview> findByUser_Username(String username);
	List<FieldReview> findBySportField_SportFieldId(Integer id);
	
//	FieldReview createReview ( FieldReview review);
	FieldReview createReview(FieldReviewDTO reviewDto);
}
