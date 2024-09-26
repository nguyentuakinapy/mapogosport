package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Booking;

public interface BookingDAO extends JpaRepository<Booking, Integer>{

}
