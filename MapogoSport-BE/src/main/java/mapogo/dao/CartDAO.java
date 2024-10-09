package mapogo.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import mapogo.entity.Cart;

public interface CartDAO extends JpaRepository<Cart, Integer> {

    @Query("SELECT c FROM Cart c JOIN c.user u WHERE u.username = :username")
    List<Cart> findCartByUsername(@Param("username") String username);
    
    //COUNT cart
    
    @Query("SELECT COUNT(c) "
    	      + "FROM Cart c "
    	      + "JOIN c.user u "
    	      + "WHERE u.username = :username")
    	Integer countCart(@Param("username") String username);

	
}