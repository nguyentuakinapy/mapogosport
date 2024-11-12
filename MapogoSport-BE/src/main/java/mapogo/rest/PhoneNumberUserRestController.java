package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.PhoneNumber;
import mapogo.entity.PhoneNumberUser;
import mapogo.service.PhoneNumberUserService;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class PhoneNumberUserRestController {
	@Autowired
	PhoneNumberUserService phoneNumberUserService;
	
	@DeleteMapping("/user/phoneNumber/{phoneNumberUserId}")
	public void deletePhoneNumber(@PathVariable("phoneNumberUserId") Integer phoneNumberUserId) {
		phoneNumberUserService.deletePhoneNumberByUser(phoneNumberUserId);
	}
	
	@PostMapping("/user/phoneNumber/{username}")
	List<PhoneNumberUser> createPhoneNumberUsers(@PathVariable("username") String username, @RequestBody List<PhoneNumberUser> newPhoneNumber) {
		return phoneNumberUserService.addPhoneNumberByUsername(username, newPhoneNumber);
	}
	
	@PutMapping("/user/phoneNumber/{phoneNumberUserId}")
	public void updatePhoneNumber(@PathVariable("phoneNumberUserId") Integer phoneNumberUserId, @RequestBody PhoneNumberUser updatePhoneNumber) {
		phoneNumberUserService.updatePhoneNumberUser(phoneNumberUserId, updatePhoneNumber);
	}
}
