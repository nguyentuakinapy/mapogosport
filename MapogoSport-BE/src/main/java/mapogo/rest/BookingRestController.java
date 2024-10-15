package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Booking;
import mapogo.service.BookingService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class BookingRestController {
	
	@Autowired
	BookingService bookingService;

	@GetMapping("/booking")
	public List<Booking> findAll() {
		return bookingService.findAll();
	}
}
