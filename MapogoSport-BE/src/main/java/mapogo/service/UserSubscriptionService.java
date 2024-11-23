package mapogo.service;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dto.PaymentDTO;
import mapogo.entity.UserSubscription;

public interface UserSubscriptionService {
	//của Mỵ từ đây
	PaymentDTO createSubscriptionPayment(Map<String, Object> data, HttpServletRequest req) throws UnsupportedEncodingException;
	PaymentDTO createOwnerPayment(Map<String, Object> data, HttpServletRequest req) throws UnsupportedEncodingException;
	//đến đây
}
