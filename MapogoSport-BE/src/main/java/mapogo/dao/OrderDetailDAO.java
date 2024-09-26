package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.OrderDetail;

public interface OrderDetailDAO extends JpaRepository<OrderDetail, Integer>{

}
