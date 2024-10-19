package mapogo.service;

import java.util.List;

import mapogo.entity.PaymentMethod;

public interface PaymentMethodService {
	
	List<PaymentMethod> findAll();
	
}
