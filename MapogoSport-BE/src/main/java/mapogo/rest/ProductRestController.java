package mapogo.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import mapogo.entity.Product;
import mapogo.service.ProductService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class ProductRestController {
	@Autowired
	ProductService productService;
	
	@GetMapping("/products")
	public List<Product> findAll()
	{
		return productService.findAll();
	}
	
	@GetMapping("/products/{id}")
	public Optional<Product> findById(@PathVariable Integer id) { // Thêm @PathVariable
		return productService.findById(id); // Sửa lại tên phương thức
	}
}
