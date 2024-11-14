package mapogo.rest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dao.UserDAO;
import mapogo.dao.UserVoucherDAO;
import mapogo.dao.VoucherDAO;
import mapogo.entity.User;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.service.UserVoucherService;
import mapogo.service.VoucherService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class UserVoucherRestController {

	@Autowired
	UserVoucherService userVoucherService;
	@Autowired
	VoucherService voucherService;

	@Autowired
	VoucherDAO voucherDAO;

	@Autowired
	UserDAO userDAO;

	@Autowired
	UserVoucherDAO userVoucherDAO;

	@RequestMapping("/userVoucher")
	public List<UserVoucher> findUserVoucher() {
		return userVoucherService.findUserVoucher();
	}

	@PostMapping(value = "/userVoucher/create/{id}/{username}", consumes = "application/json")
	public void createUserVoucher(@PathVariable("id") Integer id,
			@PathVariable("username") String username) {
		Voucher v = voucherDAO.findById(id).get();
		User u = userDAO.findById(username).get();
		UserVoucher newUserVoucher = new UserVoucher();
		newUserVoucher.setDate(LocalDateTime.now());
		newUserVoucher.setStatus("Đang còn hạn");
		newUserVoucher.setUser(u);
		newUserVoucher.setVoucher(v);
		if(v.getQuantity()>0) {
			v.setQuantity(v.getQuantity()-1);
			voucherService.save(v);
		}
		userVoucherDAO.save(newUserVoucher);
	}

	@GetMapping("/userVoucher/check/{username}/{voucherId}")
	public Boolean checkUserHasVoucher(@PathVariable String username, @PathVariable Integer voucherId) {
		return userVoucherService.checkUserVoucher(username, voucherId);
	}
	
	@GetMapping("/user/voucher/{username}")
	public List<Map<String, Object>> findByUser(@PathVariable("username") String username) {
		return userVoucherService.findByUser(username);
	}
}
