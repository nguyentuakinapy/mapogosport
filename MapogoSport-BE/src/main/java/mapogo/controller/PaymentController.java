package mapogo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dto.OrderDTO;
import mapogo.dto.PaymentDTO;
import mapogo.entity.Order;
import mapogo.entity.OrderPayment;
import mapogo.entity.User;
import mapogo.service.OrderPaymentService;
import mapogo.service.OrderService;
import mapogo.utils.Config;

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
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	@Autowired
	OrderService orderService;
	
	@PostMapping("/create_payment")
	public ResponseEntity<?> createPayment(HttpServletRequest req, @RequestParam("orderId") Integer orderId) throws UnsupportedEncodingException {
		System.out.println("orderId: "+orderId);
		Order order = orderService.findByOrderId(orderId);
		
        String orderType = "other";
//        String bankCode = req.getParameter("bankCode");
		long amount = (long) (order.getAmount()*100);
//        String vnp_TxnRef = Config.getRandomNumber(8);
		String vnp_TxnRef = orderId.toString();
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
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef); //nội dung
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
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
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
        //thành công 
        order.setStatus("Đã thanh toán");
        orderService.update(order);
        paymentDTO.setStatus("ok");
        paymentDTO.setMessage("successfully");
        paymentDTO.setURL(paymentUrl);
//        com.google.gson.JsonObject job = new JsonObject();
//        job.addProperty("code", "00");
//        job.addProperty("message", "success");
//        job.addProperty("data", paymentUrl);
//        Gson gson = new Gson();
//        resp.getWriter().write(gson.toJson(job));
		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);
	}
	
	@Autowired
	OrderPaymentService orderPaymentSevice;
	
	@GetMapping("/payment_info")
	public RedirectView transaction(@RequestParam(value = "vnp_Amount") String amount,
			@RequestParam(value = "vnp_ResponseCode") String responseCode,
			@RequestParam(value = "vnp_TxnRef") String orderId){
		OrderPayment orderPayment = new OrderPayment();
		OrderPayment orderPayment1 = new OrderPayment();;
		System.out.println("amount: "+amount);
		System.out.println("orderId: "+orderId);

		if (responseCode.equals("00")) {
			String trimmedAmount = amount.substring(0, amount.length() - 2);
			orderPayment.setAmount(Double.valueOf(trimmedAmount));
			Order order = orderService.findByOrderId(Integer.parseInt(orderId));
			orderPayment.setOrder(order);
			orderPayment.setStatus("Đã thanh toán");
			orderPayment.setDate(LocalDateTime.now());
			User user = order.getUser();
			orderPayment.setUser(user);
			orderPayment.setReferenceCode(null);
			orderPayment1 = orderPaymentSevice.create(orderPayment);
		} else {
	        return new RedirectView("/errorPage"); // URL chuyển hướng khi có lỗi
	    }
	    
	    return new RedirectView("http://localhost:3000/checkout-product/successfully"); // URL chuyển hướng khi thành công
	}
	
}
