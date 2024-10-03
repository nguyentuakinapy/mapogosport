package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.User;
import mapogo.service.UserService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class UserRestController {
	@Autowired
	UserService userService;

	@GetMapping("/user/{username}")
	public User findUseLoginUser(@PathVariable("username") String username) {
		return userService.findByUsername(username);
	}

	@GetMapping("/user")
	public List<User> getAll() {
		return userService.findAll();
	}
}
