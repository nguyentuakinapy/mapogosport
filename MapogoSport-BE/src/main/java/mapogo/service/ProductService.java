package mapogo.service;

import java.util.List;
import java.util.Optional;
import mapogo.entity.Product;

public interface ProductService {	
	List<Product> findAll();
<<<<<<< HEAD
	
	Optional<Product> findById(Integer id); 
=======
	Optional<Product> findById(Integer id); // Sửa lại tên phương thức
>>>>>>> 695ed675d69c9699b1b514de646972edabe2eda3
}
