package mapogo.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductDAO;
import mapogo.dao.ProductReviewDAO;
import mapogo.dto.ProductHaveReviewDTO;
import mapogo.dto.ProductReviewDTO;
import mapogo.entity.Product;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.ProductReview;
import mapogo.service.ProductReviewService;
import mapogo.service.ProductService;

@Service
public class ProductReviewServiceImpl implements ProductReviewService {
	@Autowired
	ProductReviewDAO proReviewDao;
	@Autowired
	ProductService productService;
	@Autowired
	ProductDAO productDao;
	@Autowired
	UserServiceImpl userImpl;

	public List<ProductReview> findReviewsByProductId(int productId) {
		return proReviewDao.findReviewsByProductId(productId);
	}

	public ProductReviewDTO save(ProductReviewDTO reviewDTO) {
		reviewDTO.setDatedAt(LocalDateTime.now());
		// Convert DTO to entity before saving

		Product product = productDao.findById(reviewDTO.getProductId()).orElseThrow(
				() -> new NoSuchElementException("productId not found for ID: " + reviewDTO.getProductId()));
		
		ProductReview reviewEntity = new ProductReview();
		reviewEntity.setProduct(product);
		reviewEntity.setUser(userImpl.findByUsername(reviewDTO.getUserName()));
		reviewEntity.setRating(reviewDTO.getRating());
		reviewEntity.setComment(reviewDTO.getComment());
		reviewEntity.setDatedAt(reviewDTO.getDatedAt());

		// Save entity
		ProductReview savedReview = proReviewDao.save(reviewEntity);

		// Return DTO back after saving
		return new ProductReviewDTO(savedReview.getProductReviewId(), savedReview.getProduct().getProductId(),
				savedReview.getUser().getUsername(), savedReview.getRating(), savedReview.getComment(), savedReview.getDatedAt());
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
