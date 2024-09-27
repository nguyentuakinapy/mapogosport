package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.ProductDetail;

public interface ProductDetailDAO extends JpaRepository<ProductDetail, Integer>{

}
