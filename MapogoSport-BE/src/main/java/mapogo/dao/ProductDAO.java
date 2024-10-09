package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.Product;
import mapogo.entity.ProductDetail;

public interface ProductDAO extends JpaRepository<Product, Integer>{
	
	
	
}
