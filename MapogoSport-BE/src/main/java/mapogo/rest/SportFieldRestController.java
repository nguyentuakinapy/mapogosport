package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
	
	@GetMapping("/sport_field/{id}")
	public SportField finSportFieldById(@PathVariable("id") Integer id) {
		SportField sportField = sportFieldService.findBySportFieldId(id);
		  if (sportField == null) {
		        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SportField not found");
		    }
		return sportField;	
	}
	
	@GetMapping("/sport_field_by_owner/{id}")
	public List<SportField> findSportFieldByOwner(@PathVariable("id") Integer id) {
		return sportFieldService.findSportFeildByOwner(id);	
	}

}
