package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.SportField;

public interface SportFieldDAO extends JpaRepository<SportField, Integer>{
	
	@Query("SELECT s FROM SportField s WHERE s.owner.id = :ownerId")
	List<SportField> findSportFieldByOwner(@Param("ownerId") Integer ownerId);
}
