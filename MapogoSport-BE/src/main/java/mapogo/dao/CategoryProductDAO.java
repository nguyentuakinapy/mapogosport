package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.CategoryProduct;

public interface CategoryProductDAO extends JpaRepository<CategoryProduct, Integer>{

}
