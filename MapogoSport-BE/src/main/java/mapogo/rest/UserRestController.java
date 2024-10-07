package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.User;
import mapogo.service.EmailService;
import mapogo.service.UserService;
import mapogo.utils.RandomUtils;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class UserRestController {
	@Autowired
	UserService userService;

	@Autowired
	EmailService emailService;

	@GetMapping("/user/{username}")
	public User findUseLoginUser(@PathVariable("username") String username) {
		return userService.findByUsername(username);
	}

	@GetMapping("/user")
	public List<User> getAll() {
		return userService.findAll();
	}

	@PostMapping("/user")
	public User saveStudents(@RequestBody User u) {
		System.out.println(u.getFullname());
		return userService.createUser(u);
	}
	
	@PutMapping("/user/{username}")
	public void putStudent(@PathVariable("username") String username, @RequestBody User u) {
		System.out.println(u.getUsername());
		userService.updateUser(u);
	}

	@PostMapping("/user/sendMail")
	public String sendMail(@RequestBody String username) {
		String otp = RandomUtils.generateOTP();
		emailService.sendEmail(username, "MapogoSport", otp);
		return otp;
	}
}
