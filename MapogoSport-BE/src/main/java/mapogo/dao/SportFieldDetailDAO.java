package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.SportFieldDetail;

public interface SportFieldDetailDAO extends JpaRepository<SportFieldDetail, Integer>{
	@Query("SELECT DISTINCT size FROM SportFieldDetail sp WHERE sp.sportField.sportFieldId = :sportFieldId")
	List<String> findSizeBySportField(@Param("sportFieldId") Integer sportFieldId);

	@Query("Select price, peakHourPrices from SportFieldDetail sp where sp.sportField.sportFieldId = :sportFieldId and sp.size = :size")
	List<Object[]> findPriceBySize(@Param("sportFieldId") Integer sportFieldId, @Param("size") String size);
}
