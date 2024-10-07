package mapogo.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.CategoryProduct;
import mapogo.service.CategoryProductService;

@RequestMapping("/rest")
@CrossOrigin("*")
@RestController
public class CategoryProductRestController {
	@Autowired
	CategoryProductService categoryProductService;
	
	@GetMapping("/category-products")
	List<CategoryProduct> findAll(){
		return categoryProductService.findAll();
	}
	
	@GetMapping("/category-products/{id}")
	Optional<CategoryProduct> findCategoryProductById(@PathVariable Integer id) {
		return categoryProductService.findById(id);
	}
}
