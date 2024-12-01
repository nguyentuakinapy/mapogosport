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
@RequestMapping("/rest/user/productReview")
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

	@GetMapping("/by{username}")
	public List<Map<String, Object>> getByUser(@PathVariable("username") String username) {
		return proReviewService.findByUser_Username(username);
	}

	@DeleteMapping("/{productReviewId}")
	public void deleteByUser(@PathVariable("productReviewId") Integer productReviewId) {
		proReviewService.deleteReviewByUser(productReviewId);
	}

	@GetMapping("/find-review-by-rating/{productId}/{rating}")
	public List<ProductReview> getMethodName(@PathVariable("productId") Integer productId,
			@PathVariable("rating") Integer rating) {
		return proReviewService.findReviewByRating(productId, rating);
	}

	@GetMapping("/ratings")
	public List<ProductHaveReviewDTO> getProductRatings() {
		return proReviewService.getProductRatings();
	}

}
