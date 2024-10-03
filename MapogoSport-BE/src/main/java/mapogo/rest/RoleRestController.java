package mapogo.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.service.RoleService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class RoleRestController {

	@Autowired
	RoleService roleService;


}
