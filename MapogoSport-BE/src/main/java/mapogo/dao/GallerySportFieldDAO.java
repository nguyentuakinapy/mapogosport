package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.GallerySportField;

public interface GallerySportFieldDAO extends JpaRepository<GallerySportField, Integer>{
	 @Query("SELECT g FROM GallerySportField g WHERE g.sportField.sportFieldId = ?1")
	 List<GallerySportField> findSportFieldId(Integer sportFieldId);
}
