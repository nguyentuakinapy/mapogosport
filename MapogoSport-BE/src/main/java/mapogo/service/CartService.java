package mapogo.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mapogo.dao.CartDAO;
import mapogo.entity.Cart;

@Service
public class CartService {
	@Autowired
	CartDAO cartDao;

	public List<Cart> findAll() {
		return cartDao.findAll();
	}

	public List<Cart> viewCart(String username) {
		return cartDao.findCartByUsername(username);
	}

	public Cart addToCart(Cart cart) {
		cart.setDate(new Date());
		return cartDao.save(cart);
	}

    // Phương thức cập nhật số lượng sản phẩm trong giỏ hàng
    @Transactional
    public void updateCartQuantity(Integer cartId, Integer quantity) {
        int updatedRows = cartDao.updateQuantity(quantity, cartId);
        if (updatedRows > 0) {
            System.out.println("Cập nhật số lượng thành công.");
        } else {
            System.out.println("Không tìm thấy giỏ hàng với CartId: " + cartId);
        }
    }

	public Integer CountItem(String username) {
		return cartDao.countCart(username);
	}

//	public void updateCart(Cart cart) {
//		cartDao.save(cart);
//	}

	public void deleteCart(Integer cartId) {
		cartDao.deleteById(cartId);
	}

	public boolean existedByCartId(Integer cartId) {
		return cartDao.existsById(cartId);
	}
}