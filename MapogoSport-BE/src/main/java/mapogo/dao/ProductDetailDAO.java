package mapogo.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.ProductDetail;
import mapogo.entity.ProductDetailSize;

public interface ProductDetailDAO extends JpaRepository<ProductDetail, Integer> {

	@Query("SELECT o FROM ProductDetail o WHERE o.product.productId = ?1")
	List<ProductDetail> findByIdProduct(Integer id);// select productDetail by productId

	@Query("SELECT pd.color, pd.productDetailId, pd.image " + "FROM ProductDetail pd "
			+ "JOIN Product p ON pd.product.productId = p.productId " + "WHERE pd.productDetailId = ( "
			+ "    SELECT MIN(pd2.productDetailId) " + "    FROM ProductDetail pd2 "
			+ "    WHERE pd2.product.productId = pd.product.productId " + "    AND pd2.color = pd.color " + ") "
			+ "AND pd.product.productId = :idProduct")
	List<Object[]> selectColorByIdProduct(@Param("idProduct") Integer idProduct); // select color by idProduct

	@Query("SELECT pds FROM ProductDetailSize pds JOIN pds.productDetail pd WHERE pd.productDetailId = :productDetailId")
	List<ProductDetailSize> selectSizeByIdProductDetail(@Param("productDetailId") Integer productDetailId); // select
																											// size by
																											// producDetailId

	@Query("SELECT pds.price FROM ProductDetailSize pds " + "JOIN pds.productDetail pd "
			+ "WHERE pd.productDetailId = :productDetailId AND pds.size.sizeId = :sizeId") // select price by
																							// ProductdetailId and
																							// sizeId
	Optional<Double> findPriceByProductDetailIdAndSizeId(@Param("productDetailId") Integer productDetailId,
			@Param("sizeId") Integer sizeId);

	@Query("SELECT pd, g " +
		       "FROM ProductDetail pd " +
		       "LEFT JOIN Gallery g ON g.productDetail = pd " +
		       "WHERE pd.productDetailId = :productDetailId")
		List<Object[]> findByImageDetailAndGalleryByIdProductDetail(@Param("productDetailId") Integer productDetailId); //hiển thị image và gallery theo idproductDetail

	// select image productDetail by productId
//	@Query("SELECT pd.image\r\n" 
//			+ "FROM ProductDetail AS pd\r\n"
//			+ "JOIN Product AS p ON p.productId = pd.product.productId\r\n"
//			+ "WHERE p.productId = :productId\r\n"
//			+ "")

}
