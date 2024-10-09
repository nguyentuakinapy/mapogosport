package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.SportFieldDetail;

<<<<<<< HEAD
=======
public interface SportFieldDetailDAO extends JpaRepository<SportFieldDetail, Integer>{
>>>>>>> b3b1d701d94b4adc3cbba87561bcdcc9f116a731

public interface SportFieldDetailDAO extends JpaRepository<SportFielDetail, Integer>{
	
	@Query("SELECT DISTINCT size FROM SportFielDetail sp WHERE sp.sportField.sportFieldId = :sportFieldId")
	List<String> findSizeBySportField(@Param("sportFieldId") Integer sportFieldId);

	@Query("Select price, peakHourPrices from SportFielDetail sp where sp.sportField.sportFieldId = :sportFieldId and sp.size = :size")
	List<Object[]> findPriceBySize(@Param("sportFieldId") Integer sportFieldId, @Param("size") String size);
	
}
