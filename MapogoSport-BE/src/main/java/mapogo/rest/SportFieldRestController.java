package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.SportField;
import mapogo.service.SportFieldService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class SportFieldRestController {

	@Autowired
	SportFieldService sportFieldService;
	
	@RequestMapping("/sport_field")
	public List<SportField>getAll(){
		return sportFieldService.findAll();
	}
}
