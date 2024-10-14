package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.SportFieldDetailDAO;
import mapogo.entity.SportFieldDetail;
import mapogo.service.SportFieldDetailService;


@Service
public class SportFieldDetailImpl implements SportFieldDetailService{

	@Autowired
	SportFieldDetailDAO sportFieldDetailDAO;
	
	@Override
	public List<SportFieldDetail> findAll() {
		return sportFieldDetailDAO.findAll();
	}

	@Override
	public List<String> findSizeBySportFieldId(Integer sportFieldId) {
		// TODO Auto-generated method stub
		return sportFieldDetailDAO.findSizeBySportField(sportFieldId);
	}

	@Override
	public List<Object[]> findPriceBySize(Integer sportFieldId, String size) {
		// TODO Auto-generated method stub
		return sportFieldDetailDAO.findPriceBySize(sportFieldId, size);
	}


}
