package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.SportFieldDetail;
import mapogo.service.SportFieldDetailService;



@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class SportFieldDetailRestController {
	
	@Autowired
	SportFieldDetailService sportFieldDetailService;

	@RequestMapping("/sport_field_detail")
	 public List<SportFieldDetail> getAll(){
		return sportFieldDetailService.findAll();	
	}
	
}
