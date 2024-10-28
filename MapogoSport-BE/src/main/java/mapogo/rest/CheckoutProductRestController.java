package mapogo.rest;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Cart;
import mapogo.service.CartService;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/rest")
@RestController
public class CheckoutProductRestController {
	@Autowired
	CartService cartService;

	@GetMapping("/checkout_product/{cartIds}")
	public List<Cart> getProductDetailSizesToCheckout(@PathVariable("cartIds") int[] cartIds) {
	    List<Cart> list = new ArrayList<>();
	    for (int id : cartIds) {
	        Cart item = cartService.findById(id); 
	        if (item != null) {
	            list.add(item);
	        }
	    }
	    return list;
	}
}
