package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.BookingPayment;

public interface BookingPaymentDAO extends JpaRepository<BookingPayment, Integer>{

}
