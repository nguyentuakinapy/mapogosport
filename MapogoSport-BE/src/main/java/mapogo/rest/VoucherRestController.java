package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.User;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.service.UserVoucherService;
import mapogo.service.VoucherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class VoucherRestController {

	@Autowired
	VoucherService voucherService;

	@RequestMapping("/voucher/active")
	public List<Voucher> selectVoucherActive() {
		return voucherService.selectVoucherActive();
	}

	@RequestMapping("/voucher/findAll")
	public List<Voucher> findAll() {
		return voucherService.finAll();
	}

	// của Mỵ từ đây

	@GetMapping("/findVoucherByUsername/{username}")
	public List<Voucher> getfindVoucher(@PathVariable("username") String username) {
		return voucherService.findByUserName(username);
	}
	// đến đây

}
