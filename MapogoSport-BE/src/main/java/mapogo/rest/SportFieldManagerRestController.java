package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Owner;
import mapogo.entity.SportField;
import mapogo.entity.User;
import mapogo.service.OwnerService;
import mapogo.service.SessionService;
import mapogo.service.SportFieldService;
import mapogo.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("api/sportfields")
public class SportFieldManagerRestController {
	@Autowired
	SessionService session;
	
	@Autowired
	SportFieldService sportService;
	
	@Autowired
	OwnerService ownerService;
	
	@Autowired
	UserService userserver;
	
	@GetMapping("/lists/{username}")
	public List<SportField> getListSportField(@PathVariable("username") String username) {
		User user = userserver.findByUsername(username);
		Owner owner = ownerService.findOwnerByUsername(user);
		System.out.println(sportService.findSportFieldByOwner(owner.getOwnerId()));
		return sportService.findSportFieldByOwner(owner.getOwnerId());
	}
	
}
