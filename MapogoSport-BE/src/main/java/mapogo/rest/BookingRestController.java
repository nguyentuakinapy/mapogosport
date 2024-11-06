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
import org.springframework.web.bind.annotation.PutMapping;
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
	
	@GetMapping("/owner/booking/findAll")
	public List<Map<String, Object>> ownerFindAll() {
		return bookingService.findAllBooking();
	}
	
	@PutMapping("/owner/booking/update")
	public void updateBookingStatus(@RequestBody Map<String, Object> bookingData) {
		bookingService.updateStatusBooking(bookingData);
	}

	@GetMapping("/user/booking/{username}")
	public List<Map<String, Object>> getByUser(@PathVariable("username") String username) {
		return bookingService.findBookingByUsername(username);
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

	@GetMapping("/booking/successful/revenue/{status}/{ownerId}")
	public List<Booking> findBookingAmountByOwnerAndStatus(@PathVariable("ownerId") Integer ownerId,
			@PathVariable("status") String status) {
		return bookingService.findBookingAmountByOwnerAndStatus(ownerId, status);
	}

	@GetMapping("/bookingdetail/booking/bysportField/byowner/{sportFieldIds}/{ownerId}")
	public List<BookingDetail> findBookingDetailBySportFieldAndOwner(
			@PathVariable("sportFieldIds") List<Integer> sportFieldIds, @PathVariable("ownerId") Integer ownerId) {

		return bookingService.findBookingDetailBySportFieldAndOwner(sportFieldIds, ownerId);
	}

	@GetMapping("/bookingdetail/booking/bysportFieldDetail/{sportFieldIds}")
	public List<Object[]> findRevenueBySportFieldDetailIds(@PathVariable("sportFieldIds") List<Integer> sportFieldIds) {
		return bookingService.findRevenueBySportFieldDetailIds(sportFieldIds);
	}

	@GetMapping("/booking/detail/findbystarttime/sportfielddetail/{startTime}/{sportFieldDetailId}/{date}")
	public BookingDetail findBookingDetailByStartTimeDateAndSportDetailId(@PathVariable("startTime") String startTime,
			@PathVariable("sportFieldDetailId") Integer sportFieldDetailId,
			@PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return bookingDetailService.findBookingDetailByStartTimeDateAndSportDetailId(startTime, sportFieldDetailId,
				date);
	}

	@GetMapping("/bookingdetail/bysportFieldDetail/{sportFieldIds}")
	public List<BookingDetail> findBookingDetailBySportFieldId(@PathVariable("sportFieldIds") Integer sportFieldIds) {
		return bookingService.findBookingDetailBySportFieldId(sportFieldIds);
	}


	// Get revenue by Date

	@GetMapping("/booking/success/revenue/byDate/{status}/{ownerId}/{startDate}/{endDate}")
	public List<Booking> findRevenueByDate(@PathVariable("status") String status,
			@PathVariable("ownerId") Integer ownerId, @PathVariable("startDate") String startDate,
			@PathVariable("endDate") String endDate) {

		return bookingService.findRevenueByDate(status, ownerId, startDate, endDate);
	}

	@GetMapping("/bookingDetail/byOwner/bySportField/byDate/{sportFieldIds}/{ownerId}/{startDate}/{endDate}")
	public List<BookingDetail> findBookingDetailByDate(@PathVariable("sportFieldIds") List<Integer> sportFieldIds,
			@PathVariable("ownerId") Integer ownerId, @PathVariable("startDate") String startDate,
			@PathVariable("endDate") String endDate) {
		return bookingService.findBookingDetailByDate(sportFieldIds, ownerId, startDate, endDate);
	}

	@GetMapping("/bookingDetail/bySportField/byDate/{sportFieldDetailIds}/{startDate}/{endDate}")
	public List<Object[]> findRevenueBySportFieldDetailIdsByDate(
			@PathVariable("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
			@PathVariable("startDate") String startDate, @PathVariable("endDate") String enDate) {

		return bookingService.findRevenueBySportFieldDetailIdsByDate(sportFieldDetailIds, startDate, enDate);
	}
	
	@GetMapping("/booking/byOwnerId/totalCustomer/{ownerId}")
	public Integer totalCustomer(@PathVariable("ownerId") Integer ownerId) {
		
		return bookingService.totalCustomer(ownerId);
	}
	
	@GetMapping("/booking/customerByMonth/byOwnerId/{year}/{ownerId}")
	public Map<Integer,Integer> findCustomerCountsByMonth(@PathVariable("year") Integer year, @PathVariable("ownerId") Integer ownerId){
		
		return bookingService.findCustomerCountsByMonth(year, ownerId);	
	}
	
	@GetMapping("/booking/customer/byOwner/byUsername/{ownerId}")
	public List<Object[]> findBookingByOwnerIdUsername(@PathVariable("ownerId") Integer ownerId){
		
		return bookingService.findBookingByOwnerIdUsername(ownerId);		
	}


	
}
