package mapogo.rest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;
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

	@GetMapping("/user/booking/{username}")
	public List<Booking> getByUser(@PathVariable("username") String username) {
		return bookingService.findByUser_Username(username);
	}

	@GetMapping("/user/booking/detail/{bookingId}")
	public Booking getById(@PathVariable("bookingId") Integer bookingId) {
		Booking booking = bookingService.findById(bookingId).stream().findFirst().orElse(null);

		if (booking != null && !booking.getBookingDetails().isEmpty()) {
			BookingDetail firstBookingDetail = booking.getBookingDetails().get(0);
			SportFieldDetail sportFieldDetail = firstBookingDetail.getSportFieldDetail();
			if (sportFieldDetail != null) {
				SportField sportField = sportFieldDetail.getSportField();
				if (sportField != null) {
					Map<String, Object> sportFieldInfo = new HashMap<>(); // Tạo Map để chứa thông tin sportField
					sportFieldInfo.put("sportFieldId", sportField.getSportFieldId());
					sportFieldInfo.put("name", sportField.getName());
					sportFieldInfo.put("address", sportField.getAddress());
					sportFieldInfo.put("opening", sportField.getOpening());
					sportFieldInfo.put("closing", sportField.getClosing());
					booking.setSportFieldInfo(sportFieldInfo);
				}
			}
		}
		return booking;
	}

	@GetMapping("/user/booking/detail/getbyday/{sportDetailId}/{date}")
	public List<BookingDetail> findBySportFieldDetailAndday(@PathVariable("sportDetailId") Integer sportDetailId,
			@PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return bookingDetailService.findBySportFieldDetailAndDay(sportDetailId, date);
	}

	@GetMapping("/user/booking/detail/getnextweek/{sportDetailId}/{startDay}/{endDay}")
	public List<BookingDetail> findBySportFieldDetailAndNextWeek(@PathVariable("sportDetailId") Integer sportDetailId,
			@PathVariable("startDay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDay,
			@PathVariable("endDay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDay) {
		System.out.println(startDay);

		return bookingDetailService.findBySportFieldDetailAndNextWeek(sportDetailId, startDay, endDay);
	}

	@PostMapping("/booking")
	public Booking saveBooking(@RequestBody Map<String, Object> b) {
		return bookingService.createBooking(b);
	}

	@PostMapping("/booking/detail")
	public BookingDetail saveBookingDetail(@RequestBody Map<String, Object> bd) {
		return bookingDetailService.createBookingDetail(bd);
	}

}
