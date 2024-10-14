package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.service.BookingDetailService;
import mapogo.service.BookingService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class BookingRestController {
	@Autowired
	BookingService bookingService;
	@Autowired
	BookingDetailService bookingDetailService;

	@GetMapping("/booking")
	public List<Booking> findAll() {
		return bookingService.findAll();
	}
	
	@GetMapping("/booking/{username}")
	public List<Booking> getByUser(@PathVariable("username") String username) {
		return bookingService.findByUser_Username(username);
	}
	
	@GetMapping("/user/booking/detail/{bookingId}")
	public BookingDetail getBookingDetail(@PathVariable("bookingId") Integer bookingId) {
		return bookingDetailService.findByBooking_BookingId(bookingId);
	}
}
