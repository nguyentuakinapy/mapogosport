package mapogo.utils;


import java.util.Random;

public class RandomUtils {
	public static String generateOTP() {
		// Tạo một đối tượng Random
		Random random = new Random();

		// Tạo một số ngẫu nhiên có 6 chữ số
		int otp = 100000 + random.nextInt(900000);

		// Chuyển số nguyên thành chuỗi và trả về
		return String.valueOf(otp);
	}
}
