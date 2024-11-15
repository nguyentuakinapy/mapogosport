package mapogo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDetailDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.SportFieldDAO;
import mapogo.dao.UserSubscriptionDAO;
import mapogo.entity.BookingDetail;
import mapogo.entity.Notification;
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

//	@Scheduled(fixedRate = 5000)
	@Scheduled(cron = "0 0,30 * * * *")
	public void printMessage() {
		LocalDateTime now = LocalDateTime.now();

		List<SportField> sportFields = sportFieldDAO.findAll();

		// Tính toán giờ hiện tại cộng thêm 30 phút
		int currentHour = now.getHour();
		int currentMinute = now.getMinute();

		Integer check = 0;

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

				bds.forEach(bd -> {
					System.err.println(bd.getStartTime() + " - " + bd.getSportFieldDetail().getName());

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
				});
				messagingTemplate.convertAndSend("/topic/bookingDetail/notification",
						spf.getOwner().getUser().getUsername());

			}
		});
	}

	@Scheduled(cron = "0 0 0 * * *") // Chạy vào lúc 0 giờ mỗi ngày
	public void checkUserSubscription() {
		List<UserSubscription> subscriptions = userSubscriptionDAO.findAll();

	}

}
