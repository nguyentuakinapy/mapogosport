package mapogo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;


@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

//	@Autowired
//	private EmailConfig emailConfig;
	public void sendEmail(String toEmail, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();
//		message.setFrom(emailConfig.getFromEmail());
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText(body);

		mailSender.send(message);

		System.out.println("Email đã được gửi thành công!");
	}
	
		@Async
	  public void sendEmailOfQuocAnh(String to, String subject, String content) {
	        try {
	            MimeMessage message = mailSender.createMimeMessage();
	            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

	            helper.setTo(to);
	            helper.setSubject(subject);
	            helper.setText(content, true); // `true` để gửi email dưới dạng HTML

	            mailSender.send(message);
	            System.out.println("Email sent successfully to " + to);
	        } catch (Exception e) {
	            System.err.println("Failed to send email: " + e.getMessage());
	            e.printStackTrace();
	        }
	    }
}
