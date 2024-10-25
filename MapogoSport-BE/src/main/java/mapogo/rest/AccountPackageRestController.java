package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.AccountPackage;
import mapogo.service.AccountPackageService;

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
}
