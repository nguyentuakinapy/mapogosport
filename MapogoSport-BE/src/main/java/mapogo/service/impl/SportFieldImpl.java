package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.SportFieldDAO;
import mapogo.entity.SportField;
import mapogo.service.SportFieldService;

@Service
public class SportFieldImpl implements SportFieldService{

	@Autowired
	SportFieldDAO sportFieldDao;
	
	@Override
	public List<SportField> findAll() {
		return sportFieldDao.findAll();
	}

}
