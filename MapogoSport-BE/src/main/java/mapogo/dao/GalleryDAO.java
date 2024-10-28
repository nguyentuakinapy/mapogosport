package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.Gallery;
import mapogo.entity.ProductDetailSize;

public interface GalleryDAO extends JpaRepository<Gallery, Integer>{
	@Query("SELECT g FROM Gallery g WHERE g.productDetail.id = :productDetailId")
	List<Gallery> findGalleryByProductDetailId(@Param("productDetailId") Integer productDetailId);

}
