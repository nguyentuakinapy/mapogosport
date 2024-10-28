package mapogo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mapogo.dao.CartDAO;
import mapogo.dao.ProductDetailSizeDAO;
import mapogo.dao.UserDAO;
import mapogo.dto.CartDTO;
import mapogo.entity.Cart;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.User;
import mapogo.service.impl.UserServiceImpl;

@Service
public class CartService {
	@Autowired
	CartDAO cartDao;
	@Autowired
	UserServiceImpl userImpl;
	@Autowired
	ProductDetailSizeDAO productDetailSizeDao;

	public List<Cart> findAll() {
		return cartDao.findAll();
	}

	public List<Cart> viewCart(String username) {
		return cartDao.findCartByUsername(username);
	}

	public Cart addToCart(CartDTO cartDto) {
		// Tạo một đối tượng Cart mới
		Cart cart = new Cart();

		// Tìm User dựa trên username
		cart.setUser(userImpl.findByUsername(cartDto.getUsername())); // Giả sử bạn có service để tìm User

		// Tìm ProductDetailSize, nếu không có thì ném ngoại lệ
		ProductDetailSize productDetailSize = productDetailSizeDao.findById(cartDto.getProductDetailSizeId())
				.orElseThrow(() -> new NoSuchElementException(
						"ProductDetailSize not found for ID: " + cartDto.getProductDetailSizeId()));

		// Kiểm tra xem giỏ hàng đã có sản phẩm này chưa
		Cart existingCart = cartDao.findByUserAndProductDetailSize(cart.getUser(), productDetailSize);

		if (existingCart != null) {
			// Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên
			existingCart.setQuantity(existingCart.getQuantity() + cartDto.getQuantity());
			return cartDao.save(existingCart); // Lưu thay đổi
		} else {
			// Nếu sản phẩm chưa có trong giỏ hàng, thiết lập các trường cho cart mới
			cart.setProductDetailSize(productDetailSize);
			cart.setDate(LocalDateTime.now()); // Thiết lập thời gian hiện tại
			cart.setTotalAmount(cartDto.getTotalAmount());
			cart.setQuantity(cartDto.getQuantity());
			return cartDao.save(cart); // Lưu giỏ hàng mới
		}
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

	//Mỵ đây
	public Cart findById(Integer cartId) {
		return cartDao.findById(cartId).get();
	}
	//đây
}