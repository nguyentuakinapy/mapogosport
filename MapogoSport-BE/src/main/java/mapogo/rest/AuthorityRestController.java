package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dao.AuthorityDAO;
import mapogo.dao.ProductDAO;
import mapogo.entity.Authority;
import mapogo.entity.Product;
import mapogo.service.AuthorityService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class AuthorityRestController {

	@Autowired
	AuthorityService authorityService;
	

	@PostMapping("/authority")
	public Authority saveAuthority(@RequestBody Authority auth) {
		return authorityService.createAuthority(auth);
	}
	
	@GetMapping("/authority")
	public List<Authority> findAllAuthority(){
		return authorityService.findAll();
	}
	
}
