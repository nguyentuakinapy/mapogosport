package mapogo.utils;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;

@Service
public class MoMoService {

	private final String accessKey = "F8BBA842ECF85";
	private final String secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
	private final String partnerCode = "MOMO";
	private final String redirectUrl = "http://localhost:8080/api/payment/momo";
	private final String ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
	private final String requestType = "payWithMethod";

	public ResponseEntity<?> createMoMoPayment(String amount, long orderId) {
		try {
//			long orderId = System.currentTimeMillis();
			long requestId = orderId;
			String orderInfo = "Thanh Toán với MoMo";
			String extraData = "";
			String orderGroupId = "";
			String lang = "vi";

			// Chuẩn bị raw signature
			String rawSignature = String.format(
					"accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
					accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId,
					requestType);

			// Tạo chữ ký HMAC SHA256
			String signature = hmacSHA256(rawSignature, secretKey);

			// Tạo request body
			Map<String, Object> requestBody = new HashMap<>();
			requestBody.put("partnerCode", partnerCode);
			requestBody.put("partnerName", "Test");
			requestBody.put("storeId", "MomoTestStore");
			requestBody.put("requestId", requestId);
			requestBody.put("amount", amount);
			requestBody.put("orderId", orderId);
			requestBody.put("orderInfo", orderInfo);
			requestBody.put("redirectUrl", redirectUrl);
			requestBody.put("ipnUrl", ipnUrl);
			requestBody.put("lang", lang);
			requestBody.put("requestType", requestType);
			requestBody.put("autoCapture", true);
			requestBody.put("extraData", extraData);
			requestBody.put("orderGroupId", orderGroupId);
			requestBody.put("signature", signature);

			// Gửi yêu cầu đến MoMo API
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.set("Content-Type", "application/json");

			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

			ResponseEntity<String> response = restTemplate.exchange(
					"https://test-payment.momo.vn/v2/gateway/api/create", HttpMethod.POST, entity, String.class);
//			System.out.println("Response from MoMo: " + response.getBody());

			return response;

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error: " + e.getMessage());
		}
	}

	private String hmacSHA256(String data, String secret) throws Exception {
		Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
		SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
		sha256_HMAC.init(secret_key);

		byte[] hash = sha256_HMAC.doFinal(data.getBytes());
		StringBuilder hexString = new StringBuilder(2 * hash.length);
		for (byte b : hash) {
			String hex = Integer.toHexString(0xff & b);
			if (hex.length() == 1)
				hexString.append('0');
			hexString.append(hex);
		}
		return hexString.toString();
	}
}
