package mapogo.service;

import java.util.List;

import mapogo.entity.SportFieldDetail;

public interface SportFieldDetailService {
	List<SportFieldDetail> findAll();

	List<String> findSizeBySportFieldId(Integer sportFieldId);

	List<Object[]> findPriceBySize(Integer sportFieldId, String size);
}
