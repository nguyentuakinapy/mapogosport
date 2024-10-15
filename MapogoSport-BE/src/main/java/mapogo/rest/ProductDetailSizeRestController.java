package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.ProductDetailSize;
import mapogo.service.ProductDetailSizeService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/product-detail-size")
public class ProductDetailSizeRestController {
	@Autowired
	ProductDetailSizeService productDetailSizeService;
	
	@GetMapping
	public List<ProductDetailSize> findAll()
	{
		return productDetailSizeService.findAll();
	}
	
	  // Fetch ProductDetailSize by ProductDetailId
    @GetMapping("/{productDetailId}")
    public List<ProductDetailSize> findByProductDetailId(@PathVariable Integer productDetailId) {
        return productDetailSizeService.findProductDetailSize_By_ProductDetailId(productDetailId);
    }
}
