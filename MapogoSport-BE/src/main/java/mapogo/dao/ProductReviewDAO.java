package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.ProductReview;

public interface ProductReviewDAO extends JpaRepository<ProductReview, Integer>{

}
