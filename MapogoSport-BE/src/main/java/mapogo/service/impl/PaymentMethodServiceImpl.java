package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.PaymentMethodDAO;
import mapogo.entity.PaymentMethod;
import mapogo.service.PaymentMethodService;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {

	@Autowired
	PaymentMethodDAO paymentMethodDAO;

	@Override
	public List<PaymentMethod> findAll() {
		return paymentMethodDAO.findAll();
	}

	@Override
	public PaymentMethod findByName(String name) {
		return paymentMethodDAO.findByName(name);
	}

}
