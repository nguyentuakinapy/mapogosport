package mapogo.service;

import java.util.List;

import mapogo.entity.ProductReview;

public interface ProductReviewService {
	List<ProductReview> findReviewsByProductId(int productId);
	ProductReview save(ProductReview review);
	List<ProductReview> findByUser_Username(String username);
}
