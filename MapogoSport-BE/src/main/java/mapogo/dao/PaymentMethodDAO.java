package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.PaymentMethod;

public interface PaymentMethodDAO extends JpaRepository<PaymentMethod, Integer> {
	// của Mỵ từ đây
	PaymentMethod findByName(String name);
	// đến đây

	PaymentMethod findByBookings_BookingId(Integer bookingId);
}
