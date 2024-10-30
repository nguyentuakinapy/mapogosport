package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductDetailSizeDAO;
import mapogo.entity.Product;
import mapogo.entity.ProductDetailSize;
import mapogo.service.ProductDetailSizeService;

@Service
public class ProductDetailSizeServiceImpl implements ProductDetailSizeService{
	@Autowired
	ProductDetailSizeDAO productDetailSizeDAO;
	
	@Override
	public List<ProductDetailSize> findAll() {
		// TODO Auto-generated method stub
		return productDetailSizeDAO.findAll();
	}

	@Override
	public List<ProductDetailSize> findProductDetailSize_By_ProductDetailId(Integer id) {
		// TODO Auto-generated method stub
		return productDetailSizeDAO.findByProductDetailId(id);
	}

	@Override
	public ProductDetailSize create(ProductDetailSize productDetailSize) {
		// TODO Auto-generated method stub
		return productDetailSizeDAO.save(productDetailSize);
	}

	@Override
	public ProductDetailSize update(ProductDetailSize productDetailSize) {
		  Optional<ProductDetailSize> existingProductDetailSize = productDetailSizeDAO.findById(productDetailSize.getProductDetailSizeId());
	        if (existingProductDetailSize.isPresent()) {
	            return productDetailSizeDAO.save(productDetailSize);  // Save will update if the product already exists
	        }
	        throw new RuntimeException("getProductDetailSizeId not found with id: " + productDetailSize.getProductDetailSizeId());
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		productDetailSizeDAO.deleteById(id);
		
	}


}
