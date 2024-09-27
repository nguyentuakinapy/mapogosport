package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Product;

public interface ProductDAO extends JpaRepository<Product, Integer>{

}
