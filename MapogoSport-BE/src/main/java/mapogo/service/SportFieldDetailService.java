package mapogo.service;

import java.util.List;

import mapogo.entity.SportFielDetail;

public interface SportFieldDetailService {
	List<SportFielDetail> findAll();
	
	List<String> findSizeBySportFieldId(Integer sportFieId);
	
	List<Object[]> findPriceBySize(Integer sportFieId, String size);
}
