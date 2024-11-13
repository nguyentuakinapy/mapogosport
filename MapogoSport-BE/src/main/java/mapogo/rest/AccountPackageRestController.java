package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dto.AccountPackageConverter;
import mapogo.dto.AccountPackageDTO;
import mapogo.entity.AccountPackage;
import mapogo.service.AccountPackageBenefitService;
import mapogo.service.AccountPackageService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class AccountPackageRestController {
	@Autowired
	AccountPackageService accountPackageService;
	@Autowired
	AccountPackageBenefitService accountPackageBeneFitService;

	@GetMapping("/accountpackage")
	public List<AccountPackage> findAll() {
		return accountPackageService.findAll();
	}

	@PutMapping("/updateAccountPackage/{id}")
	public ResponseEntity<AccountPackageDTO> updateAccountPackage(@PathVariable Integer id,
			@RequestBody AccountPackageDTO accountPackageDTO) {
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

	@PostMapping("/create-account-package")
	public ResponseEntity<AccountPackage> createAccountPackage(@RequestBody AccountPackageDTO accountPackageDTO) {
		AccountPackage createdAccountPackage = accountPackageService.createAccountPackage(accountPackageDTO);
		return new ResponseEntity<>(createdAccountPackage, HttpStatus.CREATED);
	}

	@DeleteMapping("/delete/account-package/{id}")
	public void delete(@PathVariable("id") Integer id) {
		accountPackageService.deleteAccountPackage(id);
	}

	@DeleteMapping("/delete-account-package-benefits/{accountPackageId}")
	public ResponseEntity<String> deleteAccountPackageBenefits(@PathVariable Integer accountPackageId) {
	    try {
	        // First, delete all benefits associated with the AccountPackage
	        accountPackageBeneFitService.deleteAccountPackageBenefit(accountPackageId);

	        return ResponseEntity.ok("Benefits of the package deleted successfully.");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Error deleting benefits: " + e.getMessage());
	    }
	}


}
