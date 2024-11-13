package mapogo.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dto.ProductHaveReviewDTO;
import mapogo.dto.ProductReviewDTO;
import mapogo.entity.Product;
import mapogo.entity.ProductReview;
import mapogo.service.ProductReviewService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")

public class ProductReivewRestController {

	@Autowired
	ProductReviewService proReviewService;

	@GetMapping("/{id}")
	public List<ProductReview> getAll(@PathVariable("id") Integer id) {
		return proReviewService.findReviewsByProductId(id);
	}

	@PostMapping(value = "/save", consumes = "application/json")
	public ProductReviewDTO save(@RequestBody ProductReviewDTO reviewDTO) {
		return proReviewService.save(reviewDTO);
	}

	@GetMapping("/user/productReview/{username}")
	public List<Map<String, Object>> getByUser(@PathVariable("username") String username) {
		List<ProductReview> productReviews = proReviewService.findByUser_Username(username);
		List<Map<String, Object>> result = new ArrayList<>();
		for (ProductReview review : productReviews) {
			Map<String, Object> reviewMap = new HashMap<>();
			reviewMap.put("productReviewId", review.getProductReviewId());
			reviewMap.put("fullname", review.getUser().getFullname());
			reviewMap.put("rating", review.getRating());
			reviewMap.put("comment", review.getComment());
			reviewMap.put("datedAt", review.getDatedAt());

			Map<String, Object> productMap = new HashMap<>();
			productMap.put("productName", review.getProduct().getName());
			productMap.put("productId", review.getProduct().getProductId());

			reviewMap.put("product", productMap);
			result.add(reviewMap);
		}
		return result;
	}

	@DeleteMapping("/user/productReview/{productReviewId}")
	public void deleteByUser(@PathVariable("productReviewId") Integer productReviewId) {
		proReviewService.deleteReviewByUser(productReviewId);
	}

	@GetMapping("/user/find-review-by-rating/{productId}/{rating}")
	public List<ProductReview> getMethodName(@PathVariable("productId") Integer productId,
			@PathVariable("rating") Integer rating) {
		return proReviewService.findReviewByRating(productId, rating);
	}

	@GetMapping("/ratings")
	public List<ProductHaveReviewDTO> getProductRatings() {
		return proReviewService.getProductRatings();
	}

}
