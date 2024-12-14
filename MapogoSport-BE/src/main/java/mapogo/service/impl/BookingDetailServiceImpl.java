package mapogo.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.OwnerDAO;
import mapogo.dao.SportFieldDetailDAO;
import mapogo.dao.UserDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Owner;
import mapogo.entity.PhoneNumberUser;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.User;
import mapogo.entity.Wallet;
import mapogo.service.BookingDetailService;
import mapogo.service.TransactionService;

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
	TransactionService transactionService;

	@Autowired
	OwnerDAO ownerDAO;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Override
	public Map<String, Object> findBookingDetailByBookingId(Integer bookingId) {
	    Booking booking = bookingDAO.findByBookingId(bookingId);
	    Map<String, Object> resultMap = new HashMap<>();
	    
        Map<String, Object> bookingInfo = new HashMap<>();
        bookingInfo.put("bookingId", booking.getBookingId());
        bookingInfo.put("sportFieldName", booking.getBookingDetails().get(0).getSportFieldDetail()
        		.getSportField().getName());
        if (!booking.getUser().getFullname().equals("Offline")) {
        	bookingInfo.put("userFullname", booking.getUser().getFullname());
		} else {
			bookingInfo.put("userFullname", booking.getFullName());
		}
        bookingInfo.put("userPhoneNumber", booking.getPhoneNumber());
        bookingInfo.put("date", booking.getDate());
        bookingInfo.put("statusBooking", booking.getStatus());
        bookingInfo.put("ownerFullname", booking.getOwner().getUser().getFullname());
        bookingInfo.put("ownerPhoneNumber", booking.getOwner().getUser().getPhoneNumberUsers().stream()
        		.filter(PhoneNumberUser::getActive).map(phone -> phone.getPhoneNumber().getPhoneNumber()));
        bookingInfo.put("address", booking.getBookingDetails().get(0).getSportFieldDetail().getSportField()
        		.getAddress());
        bookingInfo.put("deposit", booking.getPercentDeposit());
        bookingInfo.put("paymentMethodName", booking.getPaymentMethod().getDescription());
        resultMap.put("booking", bookingInfo);

        List<Map<String, Object>> bookingDetailsList = new ArrayList<>();
        for (BookingDetail bookingDetail: booking.getBookingDetails()) {
        	Map<String, Object> bookingDetails = new HashMap<>();
        	bookingDetails.put("bookingDetailId", bookingDetail.getBookingDetailId());
    	    bookingDetails.put("date", bookingDetail.getDate());
    	    bookingDetails.put("sportFieldDetailName", bookingDetail.getSportFieldDetail().getName());
    	    bookingDetails.put("startTime", bookingDetail.getStartTime());
    	    bookingDetails.put("endTime", bookingDetail.getEndTime());
    	    bookingDetails.put("price", bookingDetail.getPrice());
    	    bookingDetails.put("status", bookingDetail.getStatus());
    	    bookingDetailsList.add(bookingDetails);
        }
        
        resultMap.put("bookingDetails", bookingDetailsList);
	    return resultMap;
	}

	@Override
	public BookingDetail updateStatusBookingDetail(Map<String, Object> bookingDetailData) {
		Integer bookingDetailId = (Integer) bookingDetailData.get("bookingDetailId");
		String newStatus = (String) bookingDetailData.get("status");
		
		Object refundObj = bookingDetailData.get("refundAmount");
		double refundAmount;

		if (refundObj instanceof String) {
			refundAmount = Double.valueOf((String) refundObj);
		} else if (refundObj instanceof Number) {
			refundAmount = ((Number) refundObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}


		BookingDetail bookingDetail = bookingDetailDAO.findById(bookingDetailId).get();
		if (bookingDetail != null) {
			bookingDetail.setStatus(newStatus);
			bookingDetailDAO.save(bookingDetail);
			

			Booking booking = bookingDetail.getBooking();
			if (newStatus.equals("Đã hủy")) {
				if (!booking.getUser().getUsername().equals("sportoffline")) {
					Wallet userWallet = booking.getUser().getWallet();
					if (userWallet != null) {
						transactionService.refundUserWalletBooking(userWallet, refundAmount, booking.getBookingId());
					}
					
					Owner owner = ownerDAO.findById(booking.getOwner().getOwnerId()).get();
					if (owner != null) {
						Wallet ownerWallet = owner.getUser().getWallet();
						if (ownerWallet != null) {
							transactionService.refundOwnerWalletBooking(ownerWallet, refundAmount, booking.getBookingId());
						}
					}
				}
			}
			
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
				booking.setStatus("Đã hủy");
				bookingDAO.save(booking);
			} else {
				booking.setOldTotalAmount(booking.getTotalAmount());
				booking.setTotalAmount(totalAmount);
				bookingDAO.save(booking);
			}
			
		}
		return null;
	}

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
			bd.setBookingId(bd.getBooking().getBookingId());
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

		bookingDetailDAO.save(bookingDetail);
		
		Map<String, Object> dataPush = new HashMap<String, Object>();
		dataPush.put("username", b.getOwner().getUser().getUsername());
		dataPush.put("bookingId", bookingDetail.getBookingDetailId());

		messagingTemplate.convertAndSend("/topic/bookingDetail/user/reload", b.getUser().getUsername());
		messagingTemplate.convertAndSend("/topic/bookingDetail/reload", dataPush);
		return bookingDetail;
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
			bd.setBookingId(bd.getBooking().getBookingId());
		});
		return bookingDetails;
	}

	@Override
	public BookingDetail findBookingDetailByStartTimeDateAndSportDetailId(String startTime, Integer sportFieldDetailId,
			LocalDate date) {
//		System.err.println(startTime + "-" + sportFieldDetailId + "-" + date);
		BookingDetail b = bookingDetailDAO.findBookingDetailByStartTimeAndSportDetailId(startTime, sportFieldDetailId,
				date, "Đã hủy");

		if (b != null && b.getBooking() != null) {
			User u = userDAO.findUserByBookingDetailId(b.getBookingDetailId());

			if (u.getFullname().equals("Offline")) {
				b.setFullName(b.getBooking().getFullName());
			} else {
				b.setFullName(u.getFullname());
			}
			
			b.setPhoneNumber(b.getBooking().getPhoneNumber());
			b.setCheckOffline(b.getBooking().getUser().getUsername().equals("sportoffline"));
			b.setPaymentMethod(b.getBooking().getPaymentMethod());
			b.setTotalAmount(b.getBooking().getTotalAmount());
			b.setDeposit(b.getBooking().getPercentDeposit());
			b.setStatusBooking(b.getBooking().getStatus());
			b.setBookingId(b.getBooking().getBookingId());
		}

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
			booking.setOldTotalAmount(booking.getTotalAmount());
			booking.setTotalAmount(totalAmount);
			bookingDAO.save(booking);
		}

		if (!bd.getBooking().getUser().getUsername().equals("sportoffline")) {
//			transactionService.createTransactionOwnerByPaymentBooking(bookingDetailId, totalAmount);
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

		b.setOldTotalAmount(b.getTotalAmount());
		b.setTotalAmount(totalPriceTemporary);
		bookingDAO.save(b);
		
		Map<String, Object> dataPush = new HashMap<String, Object>();
		dataPush.put("username", b.getOwner().getUser().getUsername());
		dataPush.put("bookingId", bd.getBookingDetailId());

		messagingTemplate.convertAndSend("/topic/bookingDetail/reload", dataPush);
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

		Double totalPriceTemporary = 0.0;

		List<BookingDetail> bookingDetails = bookingDetailDAO.findByBooking_BookingId(bd.getBooking().getBookingId());
		for (BookingDetail bookingDetail : bookingDetails) {
			if (!bookingDetail.getStatus().equals("Đã hủy")) {
				totalPriceTemporary = totalPriceTemporary + bookingDetail.getPrice();
			}
		}

		Booking b = bd.getBooking();

		b.setOldTotalAmount(b.getTotalAmount());
		b.setTotalAmount(totalPriceTemporary);
		bookingDAO.save(b);
		
		Map<String, Object> dataPush = new HashMap<String, Object>();
		dataPush.put("username", b.getOwner().getUser().getUsername());
		dataPush.put("bookingId", newBd.getBookingDetailId());

		messagingTemplate.convertAndSend("/topic/bookingDetail/reload", dataPush);
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

	@Override
	public void createBookingDetailPeriod(List<Map<String, Object>> bd) {
		bd.forEach(item -> {
			System.err.println(item);
			BookingDetail bookingDetail = new BookingDetail();

			SportFieldDetail spd = sportFieldDAO.findById((Integer) item.get("sportFieldDetailId")).get();
			Booking b = bookingDAO.findById((Integer) item.get("booking")).get();

			Object priceObj = item.get("price");
			Double price;

			if (priceObj instanceof String) {
				price = Double.valueOf((String) priceObj);
			} else if (priceObj instanceof Number) {
				price = ((Number) priceObj).doubleValue();
			} else {
				throw new IllegalArgumentException("totalAmount must be a String or Number");
			}

			bookingDetail.setStartTime((String) item.get("startTime"));
			bookingDetail.setEndTime((String) item.get("endTime"));
			bookingDetail.setSportFieldDetail(spd);
			bookingDetail.setPrice(price);
			bookingDetail.setDate(LocalDate.parse((String) item.get("date")));
			bookingDetail.setBooking(b);
			bookingDetail.setSubscriptionKey((String) item.get("subscriptionKey"));

			bookingDetailDAO.save(bookingDetail);
		});
		
		Booking b = bookingDAO.findById((Integer) bd.get(0).get("booking")).get();
		
		messagingTemplate.convertAndSend("/topic/bookingDetail/user/reload", b.getUser().getUsername());
		
		Map<String, Object> dataPush = new HashMap<String, Object>();
		dataPush.put("username", b.getOwner().getUser().getUsername());
		dataPush.put("bookingId", b.getBookingDetails().get(0).getBookingDetailId());

		messagingTemplate.convertAndSend("/topic/bookingDetail/user/reload", b.getUser().getUsername());
		messagingTemplate.convertAndSend("/topic/bookingDetail/reload", dataPush);
	}
}
