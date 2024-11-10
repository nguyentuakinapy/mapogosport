package mapogo.utils;

import java.util.HashMap;
import java.util.Map;

public class ParseSenderAndReceiver {
	public static Map<String, String> parseSenderAndReceiver(String input) {
        Map<String, String> result = new HashMap<>();

        // Xác định vị trí của dấu '/' đầu tiên từ bên phải
        int lastSlashIndex = input.lastIndexOf('/');
        if (lastSlashIndex == -1) {
            return result;  // Trả về kết quả rỗng nếu không có dấu '/'
        }

        // Lấy phần chuỗi từ đầu đến dấu '/' cuối cùng
        String originalMessage = input.substring(0, lastSlashIndex);
        result.put("OriginalMessage", originalMessage);

        // Lấy phần chuỗi sau dấu '/' cuối cùng
        String keyValueString = input.substring(lastSlashIndex + 1);

        // Tách chuỗi bằng dấu '-'
        String[] parts = keyValueString.split("-");

        for (String part : parts) {
            int equalIndex = part.indexOf("=");
            if (equalIndex != -1) {
                // Lấy khóa và giá trị từ phần tử, ví dụ: "SENDER=myntd" sẽ tách thành "SENDER" và "myntd"
                String key = part.substring(0, equalIndex);
                String value = part.substring(equalIndex + 1);
                result.put(key, value);
            }
        }

        return result;
    }
	
	
}
