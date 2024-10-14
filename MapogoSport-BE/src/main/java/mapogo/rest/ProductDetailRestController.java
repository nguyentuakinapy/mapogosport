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
import mapogo.entity.ProductDetailSize;
import mapogo.service.ProductDetailService;

@RequestMapping("/rest")
@CrossOrigin("*")
@RestController
public class ProductDetailRestController {
	@Autowired
	ProductDetailService productDetailService;

	@GetMapping("/product-detail")
	public List<ProductDetail> findAll() {
		return productDetailService.findAll();
	}

	@GetMapping("/product-detail/{id}")
	public List<ProductDetail> findById(@PathVariable Integer id) {
		return productDetailService.findById(id);
	}

	@GetMapping("/product-detail/color/{idProduct}")
	public List<Object[]> selectColorByProductId(@PathVariable Integer idProduct) {
		return productDetailService.selectColorByProductId(idProduct);
	}

	@GetMapping("/product-detail/size/{productDetailId}")
	public List<ProductDetailSize> selectSizeByIdProductDetail(@PathVariable Integer productDetailId) {
		return productDetailService.selectSizeByIdProductDetail(productDetailId);
	}

	@GetMapping("/product-detail/price-by-size/{productDetailId}/{sizeId}")
	public Optional<Double> findPriceByProductDetailIdAndSizeId(@PathVariable Integer productDetailId,
			@PathVariable Integer sizeId) {
		return productDetailService.findPriceByProductDetailIdAndSizeId(productDetailId, sizeId);
	}
	
	@GetMapping("/product-detail/image/gallery/{productDetailId}")
	public List<Object[]> findByImageDetailAndGalleryByIdProductDetail(@PathVariable Integer productDetailId){
		return productDetailService.findByImageDetailAndGalleryByIdProductDetail(productDetailId);
	}
}
