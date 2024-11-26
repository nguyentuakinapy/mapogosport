package mapogo.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.RedirectView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dao.PaymentMethodDAO;
import mapogo.dao.UserSubscriptionDAO;
import mapogo.dto.MoMoPaymentResponse;
import mapogo.dto.PaymentDTO;
import mapogo.entity.AccountPackage;
import mapogo.entity.Order;
import mapogo.entity.OrderDetail;
import mapogo.entity.PaymentMethod;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.UserSubscription;
import mapogo.service.AccountPackageService;
import mapogo.service.PaymentMethodService;
import mapogo.service.UserSubscriptionService;
import mapogo.utils.Config;
import mapogo.utils.MoMoService;

@Service
public class UserSubscriptionServiceImpl implements UserSubscriptionService {

	@Autowired
	AccountPackageService accountPackageService;

	@Autowired
	UserSubscriptionDAO userSubDao;

	@Autowired
	private MoMoService paymentService;

	@Override
	public PaymentDTO createSubscriptionPayment(Map<String, Object> data, HttpServletRequest req)
			throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = new PaymentDTO();
		AccountPackage accountPackage = accountPackageService.findById((Integer) data.get("accountPackageId"));

		// vnpay
		if (data.get("paymentMethod").equals("VNPay")) {
			String orderType = "other";
			long amount = (long) (accountPackage.getPrice() * 100);
			String vnp_TxnRef = LocalDateTime.now().toString();
			String vnp_IpAddr = Config.getIpAddress(req);

			String vnp_TmnCode = Config.vnp_TmnCode;

			Map<String, String> vnp_Params = new HashMap<>();
			vnp_Params.put("vnp_Version", Config.vnp_Version);
			vnp_Params.put("vnp_Command", Config.vnp_Command);
			vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
			vnp_Params.put("vnp_Amount", String.valueOf(amount));
			vnp_Params.put("vnp_CurrCode", "VND");

			vnp_Params.put("vnp_BankCode", "NCB");

			vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
			vnp_Params.put("vnp_OrderInfo",
					data.get("accountPackageId").toString() + "-" + data.get("userSubscriptionId").toString()); // nội
																												// dung
			vnp_Params.put("vnp_OrderType", orderType);

			vnp_Params.put("vnp_Locale", "vn");
			vnp_Params.put("vnp_ReturnUrl", "http://localhost:8080/rest/user/subscription/paymentInfo");
			vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

			Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
			String vnp_CreateDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

			cld.add(Calendar.MINUTE, 15);
			String vnp_ExpireDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

			List fieldNames = new ArrayList(vnp_Params.keySet());
			Collections.sort(fieldNames);
			StringBuilder hashData = new StringBuilder();
			StringBuilder query = new StringBuilder();
			Iterator itr = fieldNames.iterator();
			while (itr.hasNext()) {
				String fieldName = (String) itr.next();
				String fieldValue = (String) vnp_Params.get(fieldName);
				if ((fieldValue != null) && (fieldValue.length() > 0)) {
					// Build hash data
					hashData.append(fieldName);
					hashData.append('=');
					hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					// Build query
					query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
					query.append('=');
					query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					if (itr.hasNext()) {
						query.append('&');
						hashData.append('&');
					}
				}
			}
			String queryUrl = query.toString();
			String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
			queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
			String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;

			// thành công
			paymentDTO.setStatus("ok");
			paymentDTO.setMessage("successfully");
			paymentDTO.setURL(paymentUrl);

		} else if (data.get("paymentMethod").equals("MoMo")) {
			String info = data.get("accountPackageId") + "0" + data.get("userSubscriptionId");
			System.out.println(info);
			long amountBeforeDecimal = (long) Math.floor(accountPackage.getPrice());

			ResponseEntity<String> response = paymentService.createMoMoPayment(String.valueOf(amountBeforeDecimal), 0,
					info, "http://localhost:8080/rest/user/subscription/paymentInfo-momo");
			ObjectMapper objectMapper = new ObjectMapper();
			MoMoPaymentResponse momoResponse;
			try {
				momoResponse = objectMapper.readValue(response.getBody(), MoMoPaymentResponse.class);
				String payUrl = momoResponse.getPayUrl();
				paymentDTO.setURL(payUrl);
				paymentDTO.setStatus("ok");
				paymentDTO.setMessage("successfully");
				return paymentDTO;
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		}
		return paymentDTO;

	}

	
	@Autowired
	PaymentMethodDAO paymentMethodDAO;
	
	@Autowired
	UserSubscriptionDAO userSubscriptionDAO;
	
	@Override
	public PaymentDTO createOwnerPayment(Map<String, Object> data, HttpServletRequest req)
			throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = new PaymentDTO();
		PaymentMethod pay = paymentMethodDAO.findById((Integer) data.get("paymentMethodId")).get();
		UserSubscription userSubscription= userSubscriptionDAO.findById((Integer) data.get("userSubscriptionId")).get();
		int price = (int) userSubscription.getAccountPackage().getPrice();
		// vnpay
		if (pay.getName().equals("VNPay")) {
			String orderType = "other";
			long amount = (long) (price * 100);
			String vnp_TxnRef = LocalDateTime.now().toString();
			String vnp_IpAddr = Config.getIpAddress(req);

			String vnp_TmnCode = Config.vnp_TmnCode;

			Map<String, String> vnp_Params = new HashMap<>();
			vnp_Params.put("vnp_Version", Config.vnp_Version);
			vnp_Params.put("vnp_Command", Config.vnp_Command);
			vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
			vnp_Params.put("vnp_Amount", String.valueOf(amount));
			vnp_Params.put("vnp_CurrCode", "VND");

			vnp_Params.put("vnp_BankCode", "NCB");

			vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
			vnp_Params.put("vnp_OrderInfo",
					data.get("userSubscriptionId").toString() + "-" + data.get("ownerId").toString()+
					"-" + data.get("authorityId").toString());

			vnp_Params.put("vnp_OrderType", orderType);

			vnp_Params.put("vnp_Locale", "vn");
			vnp_Params.put("vnp_ReturnUrl", "http://localhost:8080/rest/subscription/paymentInfo-Vnpay");
			vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

			Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
			String vnp_CreateDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

			cld.add(Calendar.MINUTE, 15);
			String vnp_ExpireDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

			List fieldNames = new ArrayList(vnp_Params.keySet());
			Collections.sort(fieldNames);
			StringBuilder hashData = new StringBuilder();
			StringBuilder query = new StringBuilder();
			Iterator itr = fieldNames.iterator();
			while (itr.hasNext()) {
				String fieldName = (String) itr.next();
				String fieldValue = (String) vnp_Params.get(fieldName);
				if ((fieldValue != null) && (fieldValue.length() > 0)) {
					// Build hash data
					hashData.append(fieldName);
					hashData.append('=');
					hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					// Build query
					query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
					query.append('=');
					query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					if (itr.hasNext()) {
						query.append('&');
						hashData.append('&');
					}
				}
			}
			String queryUrl = query.toString();
			String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
			queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
			String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;

			// thành công
			paymentDTO.setStatus("ok");
			paymentDTO.setMessage("successfully");
			paymentDTO.setURL(paymentUrl);

		} else if (pay.getName().equals("MoMo")) {
			String info = 
					data.get("userSubscriptionId").toString() + "-" + data.get("ownerId").toString()+
					"-" + data.get("authorityId").toString();
			System.out.println(info);
			long amountBeforeDecimal = (long) Math.floor(price);

			ResponseEntity<String> response = paymentService.createMoMoPayment(String.valueOf(amountBeforeDecimal), 0,
					info, "http://localhost:8080/rest/subscription/paymentInfo-momo");
			ObjectMapper objectMapper = new ObjectMapper();
			MoMoPaymentResponse momoResponse;
			try {
				momoResponse = objectMapper.readValue(response.getBody(), MoMoPaymentResponse.class);
				String payUrl = momoResponse.getPayUrl();
				paymentDTO.setURL(payUrl);
				paymentDTO.setStatus("ok");
				paymentDTO.setMessage("successfully");
				return paymentDTO;
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		}
		return paymentDTO;
	}

	@Override
	public PaymentDTO createPaymentRecharge(Map<String, Object> data,  HttpServletRequest req) throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = new PaymentDTO();
		PaymentMethod pay = paymentMethodDAO.findByName((String) data.get("selectedPaymentMethod"));
		int money = (int) data.get("money");
		// vnpay
		if (pay.getName().equals("VNPay")) {
			String orderType = "other";
			long amount = (long) (money * 100);
			String vnp_TxnRef = LocalDateTime.now().toString();
			String vnp_IpAddr = Config.getIpAddress(req);

			String vnp_TmnCode = Config.vnp_TmnCode;

			Map<String, String> vnp_Params = new HashMap<>();
			vnp_Params.put("vnp_Version", Config.vnp_Version);
			vnp_Params.put("vnp_Command", Config.vnp_Command);
			vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
			vnp_Params.put("vnp_Amount", String.valueOf(amount));
			vnp_Params.put("vnp_CurrCode", "VND");

			vnp_Params.put("vnp_BankCode", "NCB");

			vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
			vnp_Params.put("vnp_OrderInfo",
					data.get("username").toString() + "-" + data.get("money").toString());

			vnp_Params.put("vnp_OrderType", orderType);

			vnp_Params.put("vnp_Locale", "vn");
			vnp_Params.put("vnp_ReturnUrl", "http://localhost:8080/rest/wallet/createpaymentrecharge/infoVnpay");
			vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

			Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
			String vnp_CreateDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

			cld.add(Calendar.MINUTE, 15);
			String vnp_ExpireDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

			List fieldNames = new ArrayList(vnp_Params.keySet());
			Collections.sort(fieldNames);
			StringBuilder hashData = new StringBuilder();
			StringBuilder query = new StringBuilder();
			Iterator itr = fieldNames.iterator();
			while (itr.hasNext()) {
				String fieldName = (String) itr.next();
				String fieldValue = (String) vnp_Params.get(fieldName);
				if ((fieldValue != null) && (fieldValue.length() > 0)) {
					// Build hash data
					hashData.append(fieldName);
					hashData.append('=');
					hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					// Build query
					query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
					query.append('=');
					query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					if (itr.hasNext()) {
						query.append('&');
						hashData.append('&');
					}
				}
			}
			String queryUrl = query.toString();
			String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
			queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
			String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;

			// thành công
			paymentDTO.setStatus("ok");
			paymentDTO.setMessage("successfully");
			paymentDTO.setURL(paymentUrl);

		} else if (pay.getName().equals("MoMo")) {
			String info = data.get("username").toString() + "-" + data.get("money").toString();
			System.out.println(info);
			long amountBeforeDecimal = (long) Math.floor(money);

			ResponseEntity<String> response = paymentService.createMoMoPayment(String.valueOf(amountBeforeDecimal), 0,
					info, "http://localhost:8080/rest/wallet/createpaymentrecharge/infoMomo");
			ObjectMapper objectMapper = new ObjectMapper();
			MoMoPaymentResponse momoResponse;
			try {
				momoResponse = objectMapper.readValue(response.getBody(), MoMoPaymentResponse.class);
				String payUrl = momoResponse.getPayUrl();
				paymentDTO.setURL(payUrl);
				paymentDTO.setStatus("ok");
				paymentDTO.setMessage("successfully");
				return paymentDTO;
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		}
		return paymentDTO;
	}

}
