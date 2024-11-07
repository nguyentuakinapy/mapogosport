package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Voucher;
import mapogo.service.VoucherService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class VoucherRestController {
	
	@Autowired
	VoucherService voucherService;
	
	@RequestMapping("/voucher/active")
	public List<Voucher> selectVoucherActive(){
		return voucherService.selectVoucherActive();
	}
	
	@RequestMapping("/voucher/findAll")
	public List<Voucher> findAll(){
		return voucherService.finAll();
	}
}
