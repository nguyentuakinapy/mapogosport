package mapogo.rest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dto.FieldReviewDTO;
import mapogo.entity.FieldReview;
import mapogo.service.FieldReviewService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class FieldReviewRestController {
	@Autowired
	FieldReviewService fieldReviewService;
	
	@GetMapping("/user/fieldReview/{username}")
	public List<Map<String, Object>> getByUser(@PathVariable("username") String username) {
		return fieldReviewService.findByUser_Username(username);
	}
	@GetMapping("/fieldReview/{sportFieldId}")
	public List<FieldReview> getAllReiviewBySportfielId(@PathVariable("sportFieldId") Integer sportFieldId) {
		return fieldReviewService.findBySportField_SportFieldId(sportFieldId);
	}
	
	@PostMapping("/fieldReview/save")
	public FieldReview save(@RequestBody FieldReviewDTO reviewDto) {
		return fieldReviewService.createReview(reviewDto);
	}
	
	@DeleteMapping("/user/fieldReview/{fieldReviewId}")
	public void deleteByUser(@PathVariable("fieldReviewId") Integer fieldReviewId) {
		fieldReviewService.deleteReviewByUser(fieldReviewId);
	}
	@GetMapping("/find-fielreview-by-rating/{fieldId}/{rating}")
	public List<FieldReview> getMethodName(@PathVariable("fieldId") Integer fieldId,
			@PathVariable("rating") Integer rating) {
		return fieldReviewService.findReviewByRating(fieldId, rating);
	}
	
	@GetMapping("/fieldReview/{fieldId}/user/{username}")
	public ResponseEntity<?> checkUserReview(@PathVariable Integer fieldId, @PathVariable String username) {
	    Optional<FieldReview> existingReview = fieldReviewService.findBySportField_SportFieldIdAndUser_Username(fieldId, username);
	    
	    if (existingReview.isPresent()) {
	        return ResponseEntity.ok(existingReview.get());
	    } else {
	        return ResponseEntity.noContent().build();
	    }
	}
}
