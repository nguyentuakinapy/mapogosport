package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Product;
import mapogo.service.ProductService;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class ProductRestController {

	@Autowired
	ProductService productService;
	
	@RequestMapping("/products")
	public List<Product> getAll(){
		return productService.findAll();
		
	}
	 
}
