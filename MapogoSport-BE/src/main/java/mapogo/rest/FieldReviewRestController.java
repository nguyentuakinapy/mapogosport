package mapogo.rest;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	public List<FieldReview> getByUser(@PathVariable("username") String username) {
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
}
