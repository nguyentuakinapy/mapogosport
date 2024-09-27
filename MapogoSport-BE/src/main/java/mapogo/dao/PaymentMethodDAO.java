package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.PaymentMethod;

public interface PaymentMethodDAO extends JpaRepository<PaymentMethod, Integer>{

}
