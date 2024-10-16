package mapogo.service;

import java.util.List;

import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;

public interface SportFieldDetailService {
	List<SportFieldDetail> findAll();

	List<String> findSizeBySportFieldId(Integer sportFieldId);

	List<Object[]> findPriceBySize(Integer sportFieldId, String size);
	
	//của Mỵ từ đây
	List<SportFieldDetail> findBySportField(SportField sportField);
	
	SportFieldDetail findBySportFielDetailId(Integer id);
	//đến đây
}
