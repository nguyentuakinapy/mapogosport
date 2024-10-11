package mapogo.utils;

public class RemoveSpaceUtils {
	public static String removeVietnameseAccent(String input) {
        String noAccent = input.replaceAll("[áàảãạăắằẳẵặâấầẩẫậ]", "a")
                                .replaceAll("[éèẻẽẹêếềểễệ]", "e")
                                .replaceAll("[óòỏõọôốồổỗộơớờởỡợ]", "o")
                                .replaceAll("[íìỉĩị]", "i")
                                .replaceAll("[úùủũụưứừửữự]", "u")
                                .replaceAll("[ýỳỷỹỵ]", "y")
                                .replaceAll("[đ]", "d")
                                .replaceAll("[ÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ]", "A")
                                .replaceAll("[ÉÈẺẼẸÊẾỀỂỄỆ]", "E")
                                .replaceAll("[ÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ]", "O")
                                .replaceAll("[ÍÌỈĨỊ]", "I")
                                .replaceAll("[ÚÙỦŨỤƯỨỪỬỮỰ]", "U")
                                .replaceAll("[ÝỲỶỸỴ]", "Y")
                                .replaceAll("[Đ]", "D")
                                .replaceAll("\\s+", "_"); // Loại bỏ khoảng trắng
        return noAccent;
    }
}
