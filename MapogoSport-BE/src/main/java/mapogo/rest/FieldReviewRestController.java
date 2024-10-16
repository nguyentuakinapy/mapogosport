package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.FieldReview;
import mapogo.service.FieldReviewService;

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

}
