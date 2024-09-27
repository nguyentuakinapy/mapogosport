package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.FavoriteField;

public interface FavoriteFieldDAO extends JpaRepository<FavoriteField, Integer>{

}
