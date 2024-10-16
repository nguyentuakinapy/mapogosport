package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.FavoriteField;

public interface FavoriteFieldDAO extends JpaRepository<FavoriteField, Integer>{
	List<FavoriteField> findByUser_Username(String username);
}
