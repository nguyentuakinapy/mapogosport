package mapogo.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductReviewDAO;
import mapogo.dto.ProductReviewDTO;
import mapogo.entity.Product;
import mapogo.entity.ProductReview;

@Service
public class ProductReviewService {
	@Autowired
	ProductReviewDAO proReviewDao;

	public List<ProductReview> findReviewsByProductId(int productId) {
		return proReviewDao.findReviewsByProductId(productId);
	}

	public ProductReview save(ProductReview review) {
		review.setDatedAt(new Date());
		return proReviewDao.save(review);
	}

}
