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
	
	@DeleteMapping("/user/address/{addressUserId}")
    public void deleteAddress(@PathVariable("addressUserId") Integer addressUserId) {
        addressUserService.deleteAddressByUser(addressUserId);
    }
	
	@PostMapping("/user/address/{username}")
	public List<AddressUser> createAddressUsers(@PathVariable("username") String username, @RequestBody List<AddressUser> newAddresses) {
		return addressUserService.addAddressByUsername(username, newAddresses);
	}
	
	@PutMapping("/user/address/{addressUserId}")
	public void updateAddressUser(@PathVariable("addressUserId") Integer addressUserId, @RequestBody AddressUser updateAddress) {
		addressUserService.updateAddressUser(addressUserId, updateAddress);
	}
	
}
