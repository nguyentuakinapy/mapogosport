package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.FieldReview;

public interface FieldReviewDAO extends JpaRepository<FieldReview, Integer>{
	List<FieldReview> findByUser_Username(String username);
}
