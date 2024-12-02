package mapogo.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.websocket.server.PathParam;
import mapogo.entity.UserSubscription;
import mapogo.service.UserSubscriptionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class UserSubscriptionResController {
	@Autowired
	UserSubscriptionService userSubService;

	@GetMapping("/userSubscription")
	public List<UserSubscription> findAll() {
		return userSubService.findAll();
	}
	
	@GetMapping("/userSubscription/{id}")
	public List<UserSubscription> findById(@PathVariable("id") int id) {
		return userSubService.findByAccountPackageId(id);
	}

}
