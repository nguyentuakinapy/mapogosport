package mapogo.service;

import java.util.List;
import java.util.Optional;
import mapogo.entity.Product;

public interface ProductService {	
	List<Product> findAll();
	
	Optional<Product> findById(Integer id); // Sửa lại tên phương thức 
	Product create(Product product);
	Product update(Product product);
	void deleteById(Integer id);
}
