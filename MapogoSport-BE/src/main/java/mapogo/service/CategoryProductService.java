package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.CategoryProduct;

public interface CategoryProductService {
	
	List<CategoryProduct> findAll();
	
	Optional<CategoryProduct> findById(Integer id);
	
}
