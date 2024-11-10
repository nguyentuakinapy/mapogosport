package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.Product;
import mapogo.entity.ProductDetailSize;

public interface ProductDetailSizeDAO extends JpaRepository<ProductDetailSize, Integer>{
	  @Query("SELECT pds FROM ProductDetailSize pds WHERE pds.productDetail.id = :productDetailId")
	    List<ProductDetailSize> findByProductDetailId(@Param("productDetailId") Integer productDetailId);
	  
//	  @Query("SELECT o.product from ProductDetail o where  o.productDetailId = ?1")	  
//		Product findProduct_Id_By_Product_Detail_Id(@Param("productDetailId") Integer productDetailId);
	  //Mỵ
	  ProductDetailSize  findByProductDetailSizeId(Integer productDetailSizeId);
	  //My
	   @Query("SELECT SUM(pds.quantity) FROM ProductDetailSize pds WHERE pds.productDetail.product.productId = :productId")
	    Integer getTotalQuantityByProductId(@Param("productId") Integer productId);
	   
	   @Query("SELECT pds.productDetail.id FROM ProductDetailSize pds WHERE pds.id = :productDetailSizeId")
	    Integer findProductDetailIdByProductDetailSizeId(@Param("productDetailSizeId") Integer productDetailSizeId);
}
