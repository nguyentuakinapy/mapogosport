package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.User;
import mapogo.entity.UserVoucher;
import mapogo.service.UserVoucherService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class UserVoucherRestController {

	@Autowired
	UserVoucherService userVoucherService;
	
	@RequestMapping("/userVoucher")
	public List<UserVoucher> findUserVoucher(){
		return userVoucherService.findUserVoucher();
	}
	
	@PostMapping(value="/userVoucher/create" , consumes = "application/json")
	public UserVoucher createUserVoucher(@RequestBody UserVoucher userVoucher) {
		return userVoucherService.createUserVoucher(userVoucher);
	}
	
	@GetMapping("/userVoucher/check/{username}/{voucherId}")
	public Boolean checkUserHasVoucher(@PathVariable String username, @PathVariable Integer voucherId) {
	    return userVoucherService.checkUserVoucher(username, voucherId);
	}


	
}
