package mapogo.service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import mapogo.dao.AccountPackageDAO;
import mapogo.dao.AuthorityDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.SportFieldDAO;
import mapogo.dao.UserSubscriptionDAO;
import mapogo.entity.BookingDetail;
import mapogo.entity.Notification;
import mapogo.entity.Owner;
import mapogo.entity.SportField;
import mapogo.entity.UserSubscription;

@Service
public class NotificationScheduledService {

	@Autowired
	SportFieldDAO sportFieldDAO;

	@Autowired
	BookingDetailDAO bookingDetailDAO;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	NotificationDAO notificationDAO;

	@Autowired
	UserSubscriptionDAO userSubscriptionDAO;

	@Autowired
	AuthorityDAO authorityDAO;

	@Autowired
	AccountPackageDAO accountPackageDAO;

	@Autowired
	EmailService emailService;

//	@Scheduled(fixedRate = 5000)
	@Scheduled(cron = "0 0,30 * * * *")
	public void printMessage() {
		LocalDateTime now = LocalDateTime.now();

		List<SportField> sportFields = sportFieldDAO.findAll();

		// Tính toán giờ hiện tại cộng thêm 30 phút
		int currentHour = now.getHour();
		int currentMinute = now.getMinute();

		sportFields.forEach(spf -> {

			spf.getSportFielDetails().forEach(spdt -> {
				List<BookingDetail> bds1 = bookingDetailDAO.findBySportFieldDetailAndDay(spdt.getSportFielDetailId(),
						LocalDate.now(), "Đã hủy");
				for (BookingDetail bookingDetail : bds1) {
					int startTime = Integer.parseInt(bookingDetail.getStartTime().split("h")[0]);
//					int endTime = Integer.parseInt(bookingDetail.getEndTime().split("h")[0]);
					int startMinute = Integer.parseInt(bookingDetail.getStartTime().split("h")[1]);
//					int endMinute = Integer.parseInt(bookingDetail.getEndTime().split("h")[1]);
					if ((startTime * 60 + startMinute) <= (now.getHour() * 60 + now.getMinute())) {
						bookingDetail.setStatus("Đã hoàn thành");
						bookingDetailDAO.save(bookingDetail);
						messagingTemplate.convertAndSend("/topic/bookingDetail", spf.getOwner().getOwnerId());
					}
				}
			});

			int openingHour = Integer.parseInt(spf.getOpening().split("h")[0]);
			int closingHour = Integer.parseInt(spf.getClosing().split("h")[0]);

			// Kiểm tra xem giờ hiện tại có nằm trong giờ mở cửa và đóng cửa không
			if (currentHour >= openingHour && currentHour < closingHour) {
//				System.out.println(spf.getSportFielDetails().get(0));

				// Tính toán thời gian booking bắt đầu sau 30 phút từ giờ hiện tại
				int newMinute = currentMinute;
				int newHour = currentHour;
				if (newMinute == 30) {
					newMinute = 00;
					newHour += 1;
				} else if (newMinute == 00) {
					newMinute = 30;
				}

				// Chuyển đổi thời gian mới thành chuỗi "h30"
				String bookingTime = newHour + "h" + String.format("%02d", newMinute);
				System.out.println(bookingTime);
				// Tìm các booking sẽ bắt đầu sau 30 phút
				List<BookingDetail> bds = bookingDetailDAO.findByDateAndTime(LocalDate.now(), bookingTime,
						spf.getSportFieldId());
				boolean check = false;

				if (!bds.isEmpty()) {
					for (BookingDetail bd : bds) {
						if (!bd.getStatus().equals("Đã hủy")) {
							check = true;
							// Tạo thông báo cho người dùng
							Notification n = new Notification();
							n.setUser(bd.getBooking().getOwner().getUser());
							n.setTitle("Khu vực " + spf.getName());
							n.setMessage(bd.getSportFieldDetail().getName() + " sẽ bắt đầu đá lúc " + bd.getStartTime()
									+ " đến " + bd.getEndTime());
							n.setType("info");
							n.setBooking(bd.getBooking());
							// Lưu và gửi thông báo
							notificationDAO.save(n);
						}
					}
					if (check) {
						messagingTemplate.convertAndSend("/topic/bookingDetail/notification",
								spf.getOwner().getUser().getUsername());
						messagingTemplate.convertAndSend("/topic/bookingDetail/notification/reload",
								spf.getOwner().getUser().getUsername());
					}
				}
			}
		});
	}

	@Scheduled(cron = "0 0 0 * * *") // Chạy vào lúc 0 giờ mỗi ngày
//	@Scheduled(cron = "0 * * * * *") // Chạy mỗi phút một lần
	public void checkUserSubscription() {
		Date today = new Date();

		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

		List<UserSubscription> subscriptions = userSubscriptionDAO.findAll();
		for (UserSubscription userSubscription : subscriptions) {
			Date endDate = userSubscription.getEndDay();

			if (endDate != null) {
				long timeDifference = endDate.getTime() - new Date().getTime();

				if (dateFormat.format(today).equals(dateFormat.format(endDate))) {
					userSubscription.setAccountPackage(accountPackageDAO.findById(1).get());
					userSubscription.setEndDay(userSubscription.getStartDay());
					userSubscriptionDAO.save(userSubscription);
					List<SportField> sportFields = sportFieldDAO
							.findSportFieldByOwner(userSubscription.getUser().getOwner().getOwnerId()); // Đây sẽ không
																										// gây lỗi
																										// LazyInitializationException
					for (SportField sportField : sportFields) {
						if (sportField != null) {
							sportField.setStatus("Tạm đóng");
						}
					}
					sportFieldDAO.saveAll(sportFields);

					Notification n = new Notification();
					n.setUser(userSubscription.getUser());
					n.setTitle(userSubscription.getAccountPackage().getPackageName() + " đã hết hạn!");
					n.setMessage(userSubscription.getAccountPackage().getPackageName()
							+ " đã hết hạn, gói đã quay về gói miễn phí!");
					n.setType("subscription");
					// Lưu và gửi thông báo
					notificationDAO.save(n);

					messagingTemplate.convertAndSend("/topic/notification/username",
							userSubscription.getUser().getUsername());

					emailService.sendEmail(userSubscription.getUser().getEmail(), "Thông báo hết hạn gói đăng ký.",
							userSubscription.getAccountPackage().getPackageName().toLowerCase() + " đã hết hạn"
									+ ". Vui lòng gia hạn hoặc nâng cấp thêm để tiếp tục sử dụng dịch vụ của chúng tôi!");
				} else if (timeDifference <= 5 * 24 * 60 * 60 * 1000
						&& !userSubscription.getAccountPackage().getPackageName().equals("Gói miễn phí")) {
					Calendar startCalendar = Calendar.getInstance();
					startCalendar.setTime(today);

					Calendar endCalendar = Calendar.getInstance();
					endCalendar.setTime(endDate);

					startCalendar.set(Calendar.HOUR_OF_DAY, 0);
					startCalendar.set(Calendar.MINUTE, 0);
					startCalendar.set(Calendar.SECOND, 0);
					startCalendar.set(Calendar.MILLISECOND, 0);

					endCalendar.set(Calendar.HOUR_OF_DAY, 0);
					endCalendar.set(Calendar.MINUTE, 0);
					endCalendar.set(Calendar.SECOND, 0);
					endCalendar.set(Calendar.MILLISECOND, 0);

					// Tính số ngày giữa hai ngày
					long millisecondsBetween = endCalendar.getTimeInMillis() - startCalendar.getTimeInMillis();
					long daysRemaining = millisecondsBetween / (1000 * 60 * 60 * 24);

					Notification n = new Notification();
					n.setUser(userSubscription.getUser());
					n.setTitle("Thời hạn " + userSubscription.getAccountPackage().getPackageName().toLowerCase());
					n.setMessage(
							userSubscription.getAccountPackage().getPackageName() + " còn " + daysRemaining + " ngày.");
					n.setType("subscription");
					// Lưu và gửi thông báo
					notificationDAO.save(n);

					messagingTemplate.convertAndSend("/topic/notification/username",
							userSubscription.getUser().getUsername());

					emailService.sendEmail(userSubscription.getUser().getEmail(), "Thông báo gia hạn gói đăng ký.",
							userSubscription.getAccountPackage().getPackageName() + " còn " + daysRemaining
									+ " ngày. Vui lòng gia hạn thêm để tiếp tục sử dụng dịch vụ của chúng tôi!");

				}
			}
		}
	}

}
