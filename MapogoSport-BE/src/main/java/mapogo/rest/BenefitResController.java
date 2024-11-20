package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Benefit;
import mapogo.service.BenefitService;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class BenefitResController {
	@Autowired
	BenefitService benefitService;

	@GetMapping("/admin/find-all-benefit")
	public List<Benefit> findAll() {
		return benefitService.findAll();
	}
	
	@PostMapping("/add-benefit")
	public Benefit add (@RequestBody Benefit beneFit ) {
		return benefitService.addBeneFit(beneFit);
	}

}
