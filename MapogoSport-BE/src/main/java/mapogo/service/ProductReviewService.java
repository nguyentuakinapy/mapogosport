package mapogo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductReviewDAO;
import mapogo.entity.ProductReview;

@Service
public class ProductReviewService {
	@Autowired
	ProductReviewDAO proReviewDao;

	public List<ProductReview> findReviewsByProductId(int productId) {
		return proReviewDao.findReviewsByProductId(productId);
	}

	public ProductReview save(ProductReview review) {
		//Mỵ
		review.setDatedAt(LocalDateTime.now());
		return proReviewDao.save(review);
	}

}
