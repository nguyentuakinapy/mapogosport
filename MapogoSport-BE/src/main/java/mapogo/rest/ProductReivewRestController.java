package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.ProductReview;
import mapogo.service.ProductReviewService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductReivewRestController {

	@Autowired
	ProductReviewService proReviewService;

	@GetMapping("/{id}")
	public List<ProductReview> getAll(@PathVariable("id") Integer id) {
		return proReviewService.findReviewsByProductId(id);
	}
	
	@PostMapping("/save")
	public ProductReview save(@RequestBody ProductReview review) {
	    
	    return proReviewService.save(review);
	}
	
	
	
	
}