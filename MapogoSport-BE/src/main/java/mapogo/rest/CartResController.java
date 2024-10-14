package mapogo.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Delegate;
import mapogo.dao.CartDAO;
import mapogo.entity.Cart;
import mapogo.service.CartService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/rest/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartResController {
	@Autowired
	CartService cartService;
	
	@GetMapping()
	public List<Cart> findAll() {
		return cartService.findAll();
	}
	@GetMapping("/{username}")
	public List<Cart> viewCart(@PathVariable("username") String username) {
		return cartService.viewCart(username);
	}
	
	@PostMapping("/add")
	public Cart addToCart(@RequestBody Cart cart) {
		return cartService.addToCart(cart);
	}
	
	@GetMapping("/count/{username}")
	public Integer getCountItem(@PathVariable("username") String username) {
		return cartService.CountItem(username);
	}

//    @PutMapping("/update/{cartId}")
//    public void updateCart(@RequestBody Cart cart, @PathVariable("cartId") Integer cartId) throws Exception {
//    	if (cartService.existedByCartId(cartId)) {
//    	    cartService.updateCart(cart);
//    	} else {
//    	    throw new Exception("Cart with ID " + cartId + " does not exist.");
//    	}
//    }
	
	 // Phương thức cập nhật giỏ hàng
    @PutMapping("/update/{cartId}")
    public ResponseEntity<String> updateCart(@PathVariable("cartId") Integer cartId, @RequestBody Map<String, Integer> requestBody) {
        try {
            // Lấy giá trị quantity từ body
            Integer quantity = requestBody.get("quantity");
            cartService.updateCartQuantity(cartId, quantity); // Gọi phương thức cập nhật trong service
            return ResponseEntity.ok("Cập nhật giỏ hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật giỏ hàng: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/delete/{cartId}")
    public void delete(@PathVariable("cartId") Integer cartId) throws Exception {
    	if (cartService.existedByCartId(cartId)) {
    	    cartService.deleteCart(cartId);
    	} else {
    	    throw new Exception("Cart with ID " + cartId + " does not exist.");
    	}
    }
	

}