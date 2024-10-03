package mapogo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import mapogo.dao.AccountPackageDAO;
import mapogo.entity.AccountPackage;
import mapogo.entity.User;
import mapogo.service.AccountPackageService;
import mapogo.service.UserService;
import mapogo.service.impl.AccountPackageServiceImpl;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class test {
	@Autowired 
	AccountPackageDAO us;
	
	@GetMapping("/login")
	public String getMethodName() {
		AccountPackage user= us.findById(1).get();
		
		System.out.println(user.getPackageName());
		System.out.println("knkjsankl");
		return new String();
	}
	
	
}
