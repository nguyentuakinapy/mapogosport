package mapogo.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import mapogo.entity.Cart;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.User;

public interface CartDAO extends JpaRepository<Cart, Integer> {

    @Query("SELECT c FROM Cart c JOIN c.user u WHERE u.username = :username")
    List<Cart> findCartByUsername(@Param("username") String username);
    
    //COUNT cart
    
    @Query("SELECT COUNT(c) "
    	      + "FROM Cart c "
    	      + "JOIN c.user u "
    	      + "WHERE u.username = :username")
    	Integer countCart(@Param("username") String username);
    
    // update cart
    
    @Modifying
    @Transactional
    @Query("UPDATE Cart c SET c.quantity = :quantity WHERE c.cartId = :cartId")
    int updateQuantity(@Param("quantity") Integer quantity, @Param("cartId") Integer cartId);
    
    Cart findByUserAndProductDetailSize(User user, ProductDetailSize productDetailSize);
    	

	
}