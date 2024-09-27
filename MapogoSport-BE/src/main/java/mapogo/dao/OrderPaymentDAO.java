package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.OrderPayment;

public interface OrderPaymentDAO extends JpaRepository<OrderPayment, Integer>{

}
