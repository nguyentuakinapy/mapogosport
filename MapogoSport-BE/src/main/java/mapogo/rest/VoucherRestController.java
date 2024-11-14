package mapogo.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dao.VoucherDAO;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.service.UserVoucherService;
import mapogo.service.VoucherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class VoucherRestController {

	@Autowired
	VoucherService voucherService;

	@Autowired
	VoucherDAO voucherDAO;

	@RequestMapping("/voucher/active")
	public List<Voucher> selectVoucherActive() {
		return voucherService.selectVoucherActive();
	}

	@RequestMapping("/voucher/findAll")
	public List<Voucher> findAll() {
		return voucherService.finAll();
	}

	  @PostMapping("/create/voucher")
	    public ResponseEntity<Voucher> createVoucher(@RequestBody Map<String, Object> bd) {
	        Voucher createdVoucher = voucherService.createVoucher(bd);
	        return new ResponseEntity<>(createdVoucher, HttpStatus.CREATED);
	    }
	  @PutMapping("/update/voucher/{id}")
	  public ResponseEntity<Voucher> updateVoucher(@PathVariable Integer id, @RequestBody Map<String, Object> bd) {
		  Voucher updatedVoucher = voucherService.updateVoucher(id,bd);
		  return new ResponseEntity<>(updatedVoucher, HttpStatus.CREATED);
	  }
	  
	  @PutMapping("/delete/voucher/{id}")
	  public ResponseEntity<Voucher> deleteVoucher(@PathVariable Integer id) {
		  Voucher deleteVoucher = voucherService.deleteVoucher(id);
		  return new ResponseEntity<>(deleteVoucher, HttpStatus.CREATED);
	  }
	  
	// của Mỵ từ đây
	@Autowired
	UserVoucherService userVoucherService;

	@GetMapping("/findVoucher/{userVoucherId}")
	public Voucher getfindVoucher(@PathVariable("userVoucherId") int userVoucherId) {
		UserVoucher userVoucher = userVoucherService.findByUserVoucherId(userVoucherId);
		Voucher voucher = userVoucher.getVoucher();
		return voucher;
	}
	// đến đây
}
