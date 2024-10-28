package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.PaymentMethod;
import mapogo.service.PaymentMethodService;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class PaymentMethodRestController {
	
	@Autowired
	PaymentMethodService paymentMethodService;
	
	@GetMapping("/paymentMethod")
	public List<PaymentMethod> findAll(){
		return paymentMethodService.findAll();
	}
}
