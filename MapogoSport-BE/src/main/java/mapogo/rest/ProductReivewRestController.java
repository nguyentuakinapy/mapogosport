package mapogo.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Product;
import mapogo.entity.ProductReview;
import mapogo.service.ProductReviewService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
	public ProductReview save(@RequestBody ProductReview review) {
	    
	    return proReviewService.save(review);
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
	        reviewMap.put("productName", review.getProduct().getName());
	        result.add(reviewMap);
	    }
	    return result;
	}
	
}
