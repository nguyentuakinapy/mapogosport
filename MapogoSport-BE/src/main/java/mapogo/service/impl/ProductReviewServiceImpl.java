package mapogo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductReviewDAO;
import mapogo.dto.ProductHaveReviewDTO;
import mapogo.entity.ProductReview;
import mapogo.service.ProductReviewService;


@Service
public class ProductReviewServiceImpl implements ProductReviewService{
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

	@Override
	public List<ProductReview> findByUser_Username(String username) {
		return proReviewDao.findByUser_Username(username);
	}

	@Override
	public void deleteReviewByUser(Integer productReviewId) {
		proReviewDao.deleteById(productReviewId);
	}

	@Override
	public List<ProductReview> findReviewByRating(Integer productId, Integer rating) {
		return proReviewDao.FindReviewByRating(productId, rating);
	}

	@Override
	public List<ProductHaveReviewDTO> getProductRatings() {
		return proReviewDao.getProductRatings();
	}

}
