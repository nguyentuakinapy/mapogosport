package mapogo.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductDetailDAO;
import mapogo.entity.AccountPackage;
import mapogo.entity.Product;
import mapogo.entity.ProductDetail;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.UserSubscription;
import mapogo.service.ProductDetailService;

@Service
public class ProductDetailServiceImpl implements ProductDetailService{
	@Autowired
	ProductDetailDAO detailDAO;
	
	@Override
	public List<ProductDetail> findAll() {
		// TODO Auto-generated method stub
		return detailDAO.findAll();
	}

	@Override
	public List<ProductDetail> findById(Integer id) {
		return detailDAO.findByIdProduct(id);
	}


	@Override
	public List<Object[]> selectColorByProductId(Integer idProduct) {
		return detailDAO.selectColorByIdProduct(idProduct);
	}

	@Override
	public List<ProductDetailSize> selectSizeByIdProductDetail(Integer productDetailId) {
		return detailDAO.selectSizeByIdProductDetail(productDetailId);
	}

	@Override
	public Optional<Double> findPriceByProductDetailIdAndSizeId(Integer productDetailId, Integer sizeId) {
		return detailDAO.findPriceByProductDetailIdAndSizeId(productDetailId, sizeId);
	}

	@Override
	public List<Object[]> findByImageDetailAndGalleryByIdProductDetail(Integer productDetailId) {
		return detailDAO.findByImageDetailAndGalleryByIdProductDetail(productDetailId);
	}

	@Override
	public ProductDetail create(ProductDetail productDetail) {
		// TODO Auto-generated method stub
		return detailDAO.save(productDetail);
	}


	
	@Override
	public ProductDetail update(ProductDetail productDetail) {
		Optional<ProductDetail> existingProductDetail = detailDAO.findById(productDetail.getProductDetailId());
		if (existingProductDetail.isPresent()) {
			return detailDAO.save(productDetail);  // Save will update if the product already exists
		}
		throw new RuntimeException("Product not found with id: " + productDetail.getProductDetailId());
	}
	

	@Override
	public void delete(Integer id) {
		// TODO Auto-generated method stub
		detailDAO.deleteById(id);
	}

	@Override
	public Optional<ProductDetail> findByIdProduct(Integer id) {
		 List<ProductDetail> details = detailDAO.findByIdProduct(id);
		    return details.isEmpty() ? Optional.empty() : Optional.of(details.get(0));
	}

	@Override
	public ProductDetail updateProductDetailWithMap(Map<String, Object> data) {
		return null;
	}

//	@Override
//	public ProductDetail findProduct_Id_By_Product_Detail_Id(Integer productDetail_Id) {
//		
//		return detailDAO.findProduct_Id_By_Product_Detail_Id(productDetail_Id);
//	}
	
	
	
}
