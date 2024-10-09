package mapogo.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.CartDAO;
import mapogo.entity.Cart;

@Service
public class CartService {
	@Autowired
	CartDAO cartDao;

	public List<Cart> viewCart(String username) {
		return cartDao.findCartByUsername(username);
	}

	public Cart addToCart(Cart cart) {
		cart.setDate(new Date());
		return cartDao.save(cart);
	}

	public Integer CountItem(String username) {
		return cartDao.countCart(username);
	}

	public Cart updateCart(Cart cart) {
		// Fetch the existing cart from the database using the cart ID
		Cart existingCart = cartDao.findById(cart.getCartId())
				.orElseThrow(() -> new RuntimeException("Cart not found"));
		return cartDao.save(existingCart);
	}
}