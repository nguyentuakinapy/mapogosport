package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
	//của Mỵ từ đây
	@GetMapping("/getPaymentMethod/{paymentName}")
	public PaymentMethod getPaymentMethod(@PathVariable("paymentName") String name){
		return paymentMethodService.findByName(name);
	}
	//đến đây
	
	@GetMapping("/paymentMethod/by/bookingdetailid/{id}")
	public PaymentMethod findPaymentMethodByBookingDetailId(@PathVariable("id") Integer bookingDetailId){
		return paymentMethodService.findPaymentMethodByBookingDetailId(bookingDetailId);
	}
}
