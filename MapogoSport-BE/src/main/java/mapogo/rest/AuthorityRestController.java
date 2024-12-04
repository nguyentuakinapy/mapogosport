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

import mapogo.dao.SportFieldDAO;
import mapogo.dao.UserDAO;
import mapogo.entity.Authority;
import mapogo.entity.Role;
import mapogo.entity.SportField;
import mapogo.entity.User;
import mapogo.service.AuthorityService;
import mapogo.service.EmailService;
import mapogo.service.RoleService;
import mapogo.service.SportFieldService;
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

	@Autowired
	SportFieldDAO sportFieldDAO;

	@Autowired
	EmailService emailService;

	@GetMapping("/list-users")
	public List<User> findAll() {
		return userService.findAll();
	}

	@PostMapping("/update-user-authority/{username}")
	public String updateAuthority(@PathVariable String username, @RequestBody Map<String, Object> requestBody) {

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
		String email = user.getEmail();

		if (enabled==false) {
			List<SportField> sportFields = user.getOwner().getSportsFields();
			for (SportField sport : sportFields) {
				sport.setStatus("Tạm đóng");
				sportFieldDAO.save(sport);
			}
			emailService.sendEmail(email, "MapogoSport", "Chào "+user.getFullname()+",\r\n"
					+ "\r\n"
					+ "Chúng tôi xin thông báo rằng tài khoản của bạn trên hệ thống đã bị vô hiệu hóa. "
					+ "Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này.\r\n"
					+ "\r\n"
					+ "Trân trọng,\r\n"
					+ "Đội ngũ hỗ trợ khách hàng\r\n"
					);


		}else {
			emailService.sendEmail(email, "MapogoSport", "Chào "+user.getFullname()+",\r\n"
					+ "\r\n"
					+ "Chúng tôi xin thông báo rằng tài khoản của bạn trên hệ thống đã được kích hoạt. "
					+ "Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này.\r\n"
					+ "\r\n"
					+ "Trân trọng,\r\n"
					+ "Đội ngũ hỗ trợ khách hàng\r\n"
					);
		}

		return "";
	}

	// đến đây
}
