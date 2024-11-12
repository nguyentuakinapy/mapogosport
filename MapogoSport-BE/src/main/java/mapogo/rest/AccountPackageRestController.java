package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dto.AccountPackageConverter;
import mapogo.dto.AccountPackageDTO;
import mapogo.entity.AccountPackage;
import mapogo.service.AccountPackageService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class AccountPackageRestController {
	@Autowired
	AccountPackageService accountPackageService;
	
	@GetMapping("/accountpackage")
	public List<AccountPackage> findAll(){
		return accountPackageService.findAll();
	}
	
	@PutMapping("/updateAccountPackage/{id}")
	public ResponseEntity<AccountPackageDTO> updateAccountPackage(@PathVariable Integer id, @RequestBody AccountPackageDTO accountPackageDTO) {
	    try {
	        // Chuyển DTO thành Entity
	        AccountPackage updatedPackage = accountPackageService.updateAccountPackage(id, accountPackageDTO);
	        
	        // Chuyển Entity thành DTO sau khi đã cập nhật
	        AccountPackageDTO updatedPackageDTO = new AccountPackageConverter().toDTO(updatedPackage);

	        return ResponseEntity.ok(updatedPackageDTO);
	    } catch (RuntimeException e) {
	        // Xử lý ngoại lệ nếu không tìm thấy gói đăng ký
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	    }
	}

}
