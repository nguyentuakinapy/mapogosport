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
	
	public String bodyEmail( String tempStr) {
		
		String body = String.format("""
		      <!DOCTYPE html>
				<html lang="en">
				<head>
				    <meta charset="UTF-8">
				    <meta name="viewport" content="width=device-width, initial-scale=1.0">
				    <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
				    <title>Email Template</title>
				    <style>
				    body{
				        background-color: #fefefe;
				    }
				        .email-container {
				            max-width: 600px;
				            margin: auto;
				            padding: 20px;
				            border: 1px solid #ddd;
				            border-radius: 5px;
				            font-family: Arial, sans-serif;
				            background-color: #fff;
				        }
				        .email-header {
				            text-align: center;
				            padding-bottom: 5px;
				        }
				        .email-header img {
				            max-width: 300px;
				        }
				        .email-content {
				            text-align: left;
				        }
				        .email-content h2 {
				            color: #333;
				        }
				        .highlighted-text {
				            color: #ececec; /* Màu chữ */
				            background-color: #132239; /* Màu nền xanh nổi bật */
				            padding: 20px 40px; /* Khoảng cách padding */
				            border-radius: 5px; /* Góc bo tròn */
				            font-size: 2.5rem; /* Chữ to hơn */
				            font-weight: bold; /* Đậm chữ */
				            display: inline-block; /* Đảm bảo khoảng cách */
				            text-align: center; /* Căn giữa chữ trong box */
				        }
				        .text-center {
				            text-align: center; /* Căn giữa phần chứa */
				        }
				        .email-footer {
				            text-align: center;
				            padding-top: 20px;
				            font-size: 12px;
				            color: #777;
				        }
				    </style>
				</head>
				<body>
				    <div class="email-container">
				        <div class="email-header">
				            <img src="https://res.cloudinary.com/disnzpdvj/image/upload/v1732072868/logo_ixjedz.png" alt="Logo">
				            <h2>MAPOGO SPORT</h2>
				        </div>
				        <div class="email-content">
				            <p>Bạn đã yêu cầu gửi mã xác nhận mới!</p>
				            <p class="text-center"><span class="highlighted-text">%s</span></p>
				            <p>Thân ái,<br>Phát triển bởi nhóm Mapogo Sport</p>
				        </div>
				        <div class="email-footer">
				            <p>123 Tân Chánh Hiệp, Thành phố Hồ Chí Minh, 7000</p>
				            <p>&copy; 2024 Mapogo Sport. All rights reserved.</p>
				        </div>
				    </div>
				</body>
				</html>
""", tempStr);
return body;
	}

//	@Autowired
//	private EmailConfig emailConfig;
//	public void sendEmail(String toEmail, String subject, String body) {
//		SimpleMailMessage message = new SimpleMailMessage();
////		message.setFrom(emailConfig.getFromEmail());
//		message.setTo(toEmail);
//		message.setSubject(subject);
//		message.setText(body);
//
//		mailSender.send(message);
//
//		System.out.println("Email đã được gửi thành công!");
//	}
	
	public void sendEmail(String toEmail, String subject, String body) {		 
		 try {
			 MimeMessage message = mailSender.createMimeMessage();
          MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
          helper.setTo(toEmail);
          helper.setSubject(subject);
          String bodyOtp = bodyEmail(body);
          helper.setText(bodyOtp, true);       
          mailSender.send(message);
		  } catch (Exception e) {
	            System.err.println("Failed to send email: " + e.getMessage());
	            e.printStackTrace();
	        }
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
