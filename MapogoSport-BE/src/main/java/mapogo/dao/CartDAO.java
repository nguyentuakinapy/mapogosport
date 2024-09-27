package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Cart;

public interface CartDAO extends JpaRepository<Cart, Integer>{

}
