package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Order;

public interface OrderDAO extends JpaRepository<Order, Integer>{

}
