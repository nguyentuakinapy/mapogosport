package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.FavoriteField;
import mapogo.service.FavoriteFieldService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class FavoriteFieldRestController {
	@Autowired
	FavoriteFieldService favoriteFieldService;
	
	@GetMapping("/user/favoriteField/{username}")
	public List<FavoriteField> getByUser(@PathVariable("username") String username) {
		return favoriteFieldService.findByUser_Username(username);
	}

}
