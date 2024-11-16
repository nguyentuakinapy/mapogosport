package mapogo.service.impl;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.SportFieldDAO;
import mapogo.dao.SportFieldDetailDAO;
import mapogo.dao.UserDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.PhoneNumberUser;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.User;
import mapogo.service.BookingDetailService;

@Service
public class BookingDetailServiceImpl implements BookingDetailService {

	@Autowired
	BookingDetailDAO bookingDetailDAO;

	@Autowired
	BookingDAO bookingDAO;

	@Autowired
	SportFieldDetailDAO sportFieldDAO;

	@Autowired
	UserDAO userDAO;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Override
	public List<Map<String, Object>> findBookingDetailByBookingId(Integer bookingId) {
		List<BookingDetail> bookingDetails = bookingDetailDAO.findByBooking_BookingId(bookingId);
		List<Map<String, Object>> resultMaps = new ArrayList<>();

		for (BookingDetail bookingDetail : bookingDetails) {
			Map<String, Object> bookingDetailData = new HashMap<>();

			bookingDetailData.put("bookingDetailId", bookingDetail.getBookingDetailId());
			bookingDetailData.put("date", bookingDetail.getDate());
			bookingDetailData.put("sportFieldDetailName", bookingDetail.getSportFieldDetail().getName());
			bookingDetailData.put("startTime", bookingDetail.getStartTime());
			bookingDetailData.put("endTime", bookingDetail.getEndTime());
			bookingDetailData.put("price", bookingDetail.getPrice());
			bookingDetailData.put("status", bookingDetail.getStatus());
			bookingDetailData.put("address", bookingDetail.getSportFieldDetail().getSportField().getAddress());
			bookingDetailData.put("ownerFullname",
					bookingDetail.getSportFieldDetail().getSportField().getOwner().getUser().getFullname());
			for (PhoneNumberUser user : bookingDetail.getSportFieldDetail().getSportField().getOwner().getUser()
					.getPhoneNumberUsers()) {
				if (user.getActive()) {
					bookingDetailData.put("ownerPhoneNumberUsers", user.getPhoneNumber().getPhoneNumber());
				}
			}

			resultMaps.add(bookingDetailData);
		}
		return resultMaps;
	}

	@Override
	public BookingDetail updateStatusBookingDetail(Map<String, Object> bookingDetailData) {
		Integer bookingDetailId = (Integer) bookingDetailData.get("bookingDetailId");
		String newStatus = (String) bookingDetailData.get("status");

		Optional<BookingDetail> optionalBookingDetail = bookingDetailDAO.findById(bookingDetailId);
		if (optionalBookingDetail.isPresent()) {
			BookingDetail bookingDetail = optionalBookingDetail.get();
			bookingDetail.setStatus(newStatus);
			bookingDetailDAO.save(bookingDetail);

			Booking booking = bookingDetail.getBooking();
			boolean allCancel = booking.getBookingDetails().stream()
					.allMatch(detail -> "Đã hủy".equals(detail.getStatus()));
			if (allCancel) {
				booking.setStatus("Đã hủy");
				bookingDAO.save(booking);
			}
		}
		return null;
	}

//	@Override
//	public List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId) {
//		return bookingDetailDAO.findBySportFieldDetailAndToday(sportDetailId);
//	}

	public List<BookingDetail> findBySportFieldDetailAndNextWeek(Integer sportFieldDetailId, LocalDate today,
			LocalDate endDate) {
		List<BookingDetail> bookingDetails = bookingDetailDAO.findBySportFieldDetailAndDateBetween(sportFieldDetailId,
				today, endDate, "Đã hủy");
		bookingDetails.forEach(bd -> {
			User u = userDAO.findUserByBookingDetailId(bd.getBookingDetailId());
			if (u.getFullname().equals("Offline")) {
				bd.setFullName(bd.getBooking().getFullName());
			} else {
				bd.setFullName(u.getFullname());
			}
		});
		return bookingDetails;
	}

	@Override
	public BookingDetail createBookingDetail(Map<String, Object> bd) {
		System.err.println(bd);

		BookingDetail bookingDetail = new BookingDetail();

		SportFieldDetail spd = sportFieldDAO.findById((Integer) bd.get("sportFieldDetailId")).get();
		Booking b = bookingDAO.findById((Integer) bd.get("booking")).get();

		Object priceObj = bd.get("price");
		Double price;

		if (priceObj instanceof String) {
			price = Double.valueOf((String) priceObj);
		} else if (priceObj instanceof Number) {
			price = ((Number) priceObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}

		bookingDetail.setStartTime((String) bd.get("startTime"));
		bookingDetail.setEndTime((String) bd.get("endTime"));
		bookingDetail.setSportFieldDetail(spd);
		bookingDetail.setPrice(price);
		bookingDetail.setDate(LocalDate.parse((String) bd.get("date")));
		bookingDetail.setBooking(b);
		bookingDetail.setSubscriptionKey((String) bd.get("subscriptionKey"));

		

		return bookingDetailDAO.save(bookingDetail);
//		return null;
	}

	@Override
	public List<BookingDetail> findBySportFieldDetailAndDay(Integer sportDetailId, LocalDate date) {
		List<BookingDetail> bookingDetails = bookingDetailDAO.findBySportFieldDetailAndDay(sportDetailId, date,
				"Đã hủy");
		bookingDetails.forEach(bd -> {
			User u = userDAO.findUserByBookingDetailId(bd.getBookingDetailId());
			if (u.getFullname().equals("Offline")) {
				bd.setFullName(bd.getBooking().getFullName());
			} else {
				bd.setFullName(u.getFullname());
			}
		});
		return bookingDetails;
	}

	@Override
	public BookingDetail findBookingDetailByStartTimeDateAndSportDetailId(String startTime, Integer sportFieldDetailId,
			LocalDate date) {
		BookingDetail b =  bookingDetailDAO.findBookingDetailByStartTimeAndSportDetailId(startTime, sportFieldDetailId, date,
				"Đã hủy");
		b.setFullName(b.getBooking().getFullName());
		b.setPhoneNumber(b.getBooking().getPhoneNumber());
		b.setCheckOffline(b.getBooking().getUser().getUsername().equals("sportoffline"));
		b.setPaymentMethod(b.getBooking().getPaymentMethod());
		return b;
	}

	@Override
	public void cancelBookingDetail(Integer bookingDetailId, String note) {
		BookingDetail bd = bookingDetailDAO.findById(bookingDetailId).get();
		bd.setStatus("Đã hủy");
		bookingDetailDAO.save(bd);
		Booking booking = bookingDAO.findById(bd.getBooking().getBookingId()).get();
		List<BookingDetail> bookingDetails = bookingDetailDAO.findByBooking_BookingId(booking.getBookingId());
		int index = 0;
		int totalAmount = 0;
		for (BookingDetail b : bookingDetails) {
			if (b.getStatus().equals("Đã hủy")) {
				index++;
			} else {
				totalAmount += b.getPrice();
			}
		}
		if (index == bookingDetails.size()) {
			booking.setNote(note);
			booking.setStatus("Đã hủy");
			bookingDAO.save(booking);
		} else {
			booking.setOldTotamAmount(booking.getTotalAmount());
			booking.setTotalAmount(totalAmount);
			bookingDAO.save(booking);
		}

	}

	@Override
	public void updateBookingDetail(Map<String, Object> data) {
		BookingDetail bd = bookingDetailDAO.findById((Integer) data.get("bookingDetailId")).get();
		SportFieldDetail spd = sportFieldDAO.findById((Integer) data.get("idSportDetail")).get();

		Object priceObj = data.get("price");
		Double price;

		if (priceObj instanceof String) {
			price = Double.valueOf((String) priceObj);
		} else if (priceObj instanceof Number) {
			price = ((Number) priceObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}

		bd.setSportFieldDetail(spd);
		bd.setDate(LocalDate.parse((String) data.get("dateBooking")));
		bd.setStartTime((String) data.get("startTimeBooking"));
		bd.setEndTime((String) data.get("endTimeBooking"));
		bd.setPrice(price);
//		System.err.println(data);
		bookingDetailDAO.save(bd);

		Double totalPriceTemporary = 0.0;

		List<BookingDetail> bookingDetails = bookingDetailDAO.findByBooking_BookingId(bd.getBooking().getBookingId());
		for (BookingDetail bookingDetail : bookingDetails) {
			if (!bookingDetail.getStatus().equals("Đã hủy")) {
				totalPriceTemporary = totalPriceTemporary + bookingDetail.getPrice();
			}
		}

		Booking b = bd.getBooking();
		
		b.setOldTotamAmount(b.getTotalAmount());
		b.setTotalAmount(totalPriceTemporary);
		bookingDAO.save(b);
	}

	@Override
	public void addNewBookingDetail(Map<String, Object> data) {
		BookingDetail bd = bookingDetailDAO.findById((Integer) data.get("bookingDetailId")).get();
		BookingDetail newBd = new BookingDetail();
		SportFieldDetail spd = sportFieldDAO.findById((Integer) data.get("newIdSportBooking")).get();

		Object priceObj = data.get("price");
		Double price;

		if (priceObj instanceof String) {
			price = Double.valueOf((String) priceObj);
		} else if (priceObj instanceof Number) {
			price = ((Number) priceObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}

		newBd.setSportFieldDetail(spd);
		newBd.setDate(LocalDate.parse((String) data.get("dateBooking")));
		newBd.setStartTime((String) data.get("startTimeBooking"));
		newBd.setEndTime((String) data.get("endTimeBooking"));
		newBd.setPrice(price);
		newBd.setBooking(bd.getBooking());
		newBd.setSubscriptionKey("addNew" + bd.getBooking().getBookingId());
		
		bookingDetailDAO.save(newBd);

//		System.err.println(data);

		Double totalPriceTemporary = 0.0;

		List<BookingDetail> bookingDetails = bookingDetailDAO.findByBooking_BookingId(bd.getBooking().getBookingId());
		for (BookingDetail bookingDetail : bookingDetails) {
			if (!bookingDetail.getStatus().equals("Đã hủy")) {
				totalPriceTemporary = totalPriceTemporary + bookingDetail.getPrice();
			    if (bookingDetail.getSubscriptionKey() != null && bookingDetail.getSubscriptionKey().contains("keybooking")) {
					break;
				} else {
					bookingDetail.setSubscriptionKey("addNew" + bd.getBooking().getBookingId());
					bookingDetailDAO.save(bookingDetail);
				}
			}
		}
		

		Booking b = bd.getBooking();
		b.setOldTotamAmount(b.getTotalAmount());
		b.setTotalAmount(totalPriceTemporary);
		bookingDAO.save(b);
	}

	@Override
	public List<BookingDetail> findBookingDetailBySubscriptionKey(String subscriptionKey) {
		return bookingDetailDAO.findBookingDetailBySubscriptionKey(subscriptionKey, "Đã hủy");
	}

	@Override
	public void cancelBookingDetailBySubscription(Integer bookingDetailId, String subscriptionKey, String note) {
		List<BookingDetail> bookingDetailsSub = bookingDetailDAO.findBySubscriptionKey(subscriptionKey);
		BookingDetail bookingDetail = bookingDetailDAO.findById(bookingDetailId).get();

		Booking booking = bookingDAO.findById(bookingDetail.getBooking().getBookingId()).get();

		bookingDetailsSub.forEach(bd -> {
			bd.setStatus("Đã hủy");
			bookingDetailDAO.save(bd);
		});

		booking.setStatus("Đã hủy");
		booking.setNote(note);
		bookingDAO.save(booking);
	}

	@Override
	public void updateStatusChuaDaChangeToDaDa(Integer bookingDetailId) {
		BookingDetail bookingDetail = bookingDetailDAO.findById(bookingDetailId).get();
		bookingDetail.setStatus("Đã hoàn thành");
		bookingDetailDAO.save(bookingDetail);
	}

	@Override
	public List<BookingDetail> findByDateAndTime(LocalDate date, String time, Integer sportFieldId) {
		List<BookingDetail> bookingDetails = bookingDetailDAO.findByDateAndTime(date, time, sportFieldId);
		bookingDetails.forEach(bd -> {
			User u = userDAO.findUserByBookingDetailId(bd.getBookingDetailId());
			if (u.getFullname().equals("Offline")) {
				bd.setFullName(bd.getBooking().getFullName());
			} else {
				bd.setFullName(u.getFullname());
			}
		});
		return bookingDetails;
	}
}
