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
	
	public List<Cart> findAll(){
		return cartDao.findAll();
	}

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

	public void updateCart(Cart cart) {
		 cartDao.save(cart);
	}
	
	public void deleteCart(Integer cartId) {
		cartDao.deleteById(cartId);
	}
	
	public boolean existedByCartId (Integer cartId) {
		return cartDao.existsById(cartId);
	}
}