package mapogo.rest;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.AddressUser;
import mapogo.service.AddressUserService;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class AddressUserRestController {
	@Autowired
	AddressUserService addressUserService;
	
	@GetMapping("/user/address/{username}")
	public List<AddressUser> getAddressUsers(@PathVariable("username") String username) {
		return addressUserService.findByUsername(username);
	}
}
