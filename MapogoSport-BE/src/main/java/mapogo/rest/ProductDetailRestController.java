package mapogo.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.ProductDetail;
import mapogo.service.ProductDetailService;

@RequestMapping("/rest")
@CrossOrigin("*")
@RestController
public class ProductDetailRestController {
	@Autowired
	ProductDetailService productDetailService;
	
	@GetMapping("/product-detail")
	public List<ProductDetail> findAll(){
		return productDetailService.findAll();
	}
	
	@GetMapping("/product-detail/{id}")
	public List<ProductDetail> findById(@PathVariable Integer id)
	{
		return productDetailService.findById(id);
	}
}
