package mapogo.service;

import java.util.List;

import mapogo.entity.FieldReview;

public interface FieldReviewService {
	List<FieldReview> findByUser_Username(String username);
}
