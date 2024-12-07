package mapogo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.fasterxml.jackson.databind.node.DoubleNode;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dao.ProductDetailSizeDAO;
import mapogo.dao.UserDAO;
import mapogo.dto.CartDTO;
import mapogo.dto.OrderDTO;
import mapogo.dto.PaymentDTO;
import mapogo.entity.Cart;
import mapogo.entity.Order;
import mapogo.entity.OrderDetail;
import mapogo.entity.OrderPayment;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.Wallet;
import mapogo.service.OrderDetailService;
import mapogo.service.OrderPaymentService;
import mapogo.service.OrderService;
import mapogo.service.ProductDetailService;
import mapogo.service.ProductDetailSizeService;
import mapogo.service.TransactionService;
import mapogo.service.UserService;
import mapogo.service.WalletService;
import mapogo.utils.Config;
import mapogo.utils.MoMoService;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
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
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rest/payment")
public class PaymentController {
	@Autowired
	OrderService orderService;

	@Autowired
	OrderPaymentService orderPaymentSevice;

	@Autowired
	ProductDetailSizeDAO pdsDAO;

	@Autowired
	OrderDetailService orderDetailService;

	@Autowired
	WalletService walletService;

	@Autowired
	TransactionService transactionService;

	@Autowired
	ProductDetailSizeDAO productDetailSizeDAO;
	
	@Autowired
	UserService userService;

//	@PostMapping("/create_payment")
	@PostMapping("/create_payment")
	public ResponseEntity<?> createPayment(HttpServletRequest req,
			@RequestBody Map<String, Object> data) throws UnsupportedEncodingException {
//		Order order = orderService.findByOrderId(orderId);
		String orderType = "other";
		Integer a = (Integer) data.get("amount");
		long amount = (long) (a* 100);
		long orderId = System.currentTimeMillis();

		String vnp_TxnRef = String.valueOf(orderId);
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
		vnp_Params.put("vnp_OrderInfo", (String) data.get("username")); // nội dung
		vnp_Params.put("vnp_OrderType", orderType);

		vnp_Params.put("vnp_Locale", "vn");
		vnp_Params.put("vnp_ReturnUrl", Config.vnp_ReturnUrl);
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

		PaymentDTO paymentDTO = new PaymentDTO();
		// thành công
		paymentDTO.setStatus("ok");
		paymentDTO.setMessage("successfully");
		paymentDTO.setURL(paymentUrl);

		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);
	}

//	@GetMapping("/payment_info")
	@GetMapping("/payment_info")
	public RedirectView transaction(@RequestParam(value = "vnp_Amount") String amount,
			@RequestParam(value = "vnp_ResponseCode") String responseCode,
			@RequestParam(value = "vnp_OrderInfo") String username) {

		User user = userService.findByUsername(username);
		String trimmedAmount = amount.substring(0, amount.length() - 2);

		if (responseCode.equals("00")) {
			// update +Balance
			Wallet wallet = walletService.findByUsername(user);
			

			// create transaction
			Transaction transaction = new Transaction();
			transaction.setWallet(wallet);
			transaction.setAmount(new BigDecimal(trimmedAmount.trim()));
			transaction.setCreatedAt(LocalDateTime.now());
			transaction.setDescription("Nạp từ hóa đơn thanh toán bằng " + " (VNPay)");
			transaction.setTransactionType("+" + trimmedAmount);
			transactionService.create(transaction);

			// create orderPayment
//			OrderPayment orderPayment = new OrderPayment();
//			orderPayment.setAmount(Double.valueOf(trimmedAmount));
//			orderPayment.setOrder(order);
//			orderPayment.setStatus("Đã thanh toán");
//			orderPayment.setDate(LocalDateTime.now());
//			orderPayment.setUser(user);
//			orderPayment.setReferenceCode(null);
//			orderPaymentSevice.create(orderPayment);

			// -balance -> create transaction
			
			Transaction transaction1 = new Transaction();
			transaction1.setWallet(wallet);
			transaction1.setAmount(new BigDecimal(trimmedAmount.trim()));
			transaction1.setCreatedAt(LocalDateTime.now());
			transaction1.setDescription("Thanh toán hóa đơn ");
			transaction1.setTransactionType("-" + trimmedAmount);
			transactionService.create(transaction1);
			
			return new RedirectView("http://localhost:3000/checkout-product?status=success");
		} else {
			// URL chuyển hướng khi có lỗi
			return new RedirectView("http://localhost:3000/checkout-product?status=fail");
		}

	}

	@Autowired
	private MoMoService paymentService;

	// @PostMapping("/create-momo-payment")
	@PostMapping("/create-momo-payment")
	public ResponseEntity<?> createMoMoPayment(@RequestBody Map<String, Object> data) throws UnsupportedEncodingException{
		int amountBeforeDecimal = (Integer) data.get("amount");
		String amount =String.valueOf(amountBeforeDecimal);
		
		return paymentService.createMoMoPayment(amount,0,(String) data.get("username"),"http://localhost:8083/rest/payment/momo");
	}

	// @GetMapping("/momo")
	@GetMapping("/momo")
	public RedirectView transaction_MoMo(@RequestParam(value = "resultCode") String resultCode,
			@RequestParam(value = "extraData") String username,
			@RequestParam(value = "amount") String amount) {

		OrderPayment orderPayment = new OrderPayment();
		

		User user = userService.findByUsername(username);

		if (resultCode.equals("0")) {
			// update +Balance
			Wallet wallet = walletService.findByUsername(user);


			// create transaction
			Transaction transaction = new Transaction();
			transaction.setWallet(wallet);
			transaction.setAmount(new BigDecimal(amount));
			transaction.setCreatedAt(LocalDateTime.now());
			transaction.setDescription("Nạp từ hóa đơn thanh toán bằng:  (MoMo)");
			transaction.setTransactionType("+" + amount);
			transactionService.create(transaction);

			// create orderPayment
//			orderPayment.setAmount(order.getAmount());
//			orderPayment.setOrder(order);
//			orderPayment.setStatus("Đã thanh toán");
//			orderPayment.setDate(LocalDateTime.now());
//			orderPayment.setUser(user);
//			orderPayment.setReferenceCode("MoMo");
//			orderPaymentSevice.create(orderPayment);

			// -balance -> create transaction
			Transaction transaction1 = new Transaction();
			transaction1.setWallet(wallet);
			transaction1.setAmount(new BigDecimal(amount));
			transaction1.setCreatedAt(LocalDateTime.now());
			transaction1.setDescription("Thanh toán hóa đơn: ");
			transaction1.setTransactionType("-" + amount);
			transactionService.create(transaction1);


			// URL chuyển hướng khi thành công?status=
			return new RedirectView("http://localhost:3000/checkout-product?status=success");
		} else {
			// URL chuyển hướng khi có lỗi
			return new RedirectView("http://localhost:3000/checkout-product/fail");
		}
	}

}
