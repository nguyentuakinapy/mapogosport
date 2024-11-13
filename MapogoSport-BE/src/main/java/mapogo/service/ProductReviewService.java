package mapogo.service;

import java.util.List;

import mapogo.dto.ProductHaveReviewDTO;
import mapogo.dto.ProductReviewDTO;
import mapogo.entity.ProductReview;

public interface ProductReviewService {
	List<ProductReview> findReviewsByProductId(int productId);
	ProductReviewDTO save(ProductReviewDTO review);
	List<ProductReview> findByUser_Username(String username);
	List<ProductReview> findReviewByRating(Integer productId, Integer rating);
	void deleteReviewByUser(Integer productReviewId);
    List<ProductHaveReviewDTO> getProductRatings();
}
