package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.SportFieldDetailDAO;
import mapogo.entity.SportFielDetail;
import mapogo.service.SportFieldDetailService;


@Service
public class SportFieldDetailImpl implements SportFieldDetailService{

	@Autowired
	SportFieldDetailDAO sportFieldDetailDAO;
	
	@Override
	public List<SportFielDetail> findAll() {
		return sportFieldDetailDAO.findAll();
	}


}
