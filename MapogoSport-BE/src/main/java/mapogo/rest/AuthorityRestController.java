package mapogo.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dao.UserDAO;
import mapogo.entity.Authority;
import mapogo.entity.Role;
import mapogo.entity.User;
import mapogo.service.AuthorityService;
import mapogo.service.RoleService;
import mapogo.service.UserService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class AuthorityRestController {

	@Autowired
	AuthorityService authorityService;

	@PostMapping("/authority")
	public Authority saveAuthority(@RequestBody Authority auth) {
		return authorityService.createAuthority(auth);
	}

	@GetMapping("/authority")
	public List<Authority> findAllAuthority() {
		return authorityService.findAll();
	}

	// của Mỵ từ đây
	@Autowired
	UserService userService;
	
	@Autowired
	UserDAO userDao;

	@Autowired
	RoleService roleService;

	@GetMapping("/list-users")
	public List<User> findAll() {
		return userService.findAll();
	}

	@PostMapping("/update-user-authority/{username}")
	public String updateAuthority(@PathVariable String username,
			@RequestBody Map<String, Object> requestBody) {

	    // Lấy các giá trị từ map
	    List<String> selectedRoles = (List<String>) requestBody.get("selectedRoles");
	    boolean enabled = (Boolean) requestBody.get("enabled");

		User user = userService.findByUsername(username);

		// Xóa các Authority hiện có của người dùng
		authorityService.deleteByUser(user);

		// Thêm các vai trò mới
		for (String roleName : selectedRoles) {
			Role role = roleService.findByName(roleName);

			Authority authority = new Authority();
			authority.setUser(user);
			authority.setRole(role);
			authorityService.createAuthority(authority);
		}
		
		user.setEnabled(enabled);
		userDao.save(user);
		return "";
	}

	// đến đây
}
