package mapogo.rest;

import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dao.ProductDetailSizeDAO;
import mapogo.entity.Order;
import mapogo.entity.OrderDetail;
import mapogo.entity.ProductDetailSize;
import mapogo.service.OrderDetailService;
import mapogo.service.OrderService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class OrderDetailRestController {
	@Autowired
	OrderDetailService orderDetailService;
	
//	@GetMapping("/admin/order-detail-by-order/{orderId}")
//	public OrderDetail getOrderdetailByOrderId(@PathVariable("orderId") Integer orderId) {
//		return (OrderDetail) orderDetailService.findByOrder_OrderId(orderId);
//	}
	
	//của Mỵ từ đây

	@Autowired
	ProductDetailSizeDAO pdsDAO;

	@Autowired
	OrderService orderService;
	
	@PostMapping("/create_orderDetail")
	public ResponseEntity<?> createPayment(HttpServletRequest req, @RequestParam("orderId") Integer orderId
			, @RequestBody List<Map<String, Integer>> data){
		
		Order order = orderService.findByOrderId(orderId);
		//create OrderDetail
		for (Map<String, Integer> item : data) {
			Integer productDetailSizeId = (Integer) item.get("productDetailSizeId");
			ProductDetailSize pds = pdsDAO.findByProductDetailSizeId(productDetailSizeId);

			Integer quantity = (Integer) item.get("quantity");

			OrderDetail orderDetail = new OrderDetail();
			orderDetail.setOrder(order);
			orderDetail.setProductDetailSize(pds);
			orderDetail.setQuantity(quantity);

			orderDetailService.create(orderDetail);
		}
		
		//update ProductDetailSize.Quantity
		List<OrderDetail> orderDetails = orderDetailService.findOrderDetailByOrderId(order.getOrderId());
		for (OrderDetail orderDetail : orderDetails) {
			ProductDetailSize pds = pdsDAO.findByProductDetailSizeId(orderDetail.getProductDetailSize().getProductDetailSizeId());
			int kho= pds.getQuantity();
			pds.setQuantity(kho-orderDetail.getQuantity());
			pdsDAO.save(pds);
		}
		return ResponseEntity.status(HttpStatus.SC_OK).body(orderDetails);
	}
	
	//đến đây
}
