package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mapogo.entity.BookingDetail;

@Repository
public interface BookingDetailDAO extends JpaRepository<BookingDetail, Integer>{
	BookingDetail findByBooking_BookingId(Integer bookingId);
}
