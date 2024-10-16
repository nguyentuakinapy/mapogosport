package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Order;

public interface OrderDAO extends JpaRepository<Order, Integer>{
	List<Order> findByUser_Username(String username);
}
