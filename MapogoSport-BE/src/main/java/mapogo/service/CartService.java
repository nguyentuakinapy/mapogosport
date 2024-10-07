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
//		cart.setTotalAmount(cart.getQuantity() * cart.getProductDetail().getProduct().getPrice());
		cart.setDate(new Date());
		return cartDao.save(cart);
	}
}
