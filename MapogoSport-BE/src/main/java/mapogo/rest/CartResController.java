package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PutMapping("/update")
    public Cart updateCart(@RequestBody Cart cart) {
        // Call service to update cart
        Cart updatedCart = cartService.updateCart(cart);

        // Return updated cart as response
        return updatedCart;
    }
	

}
