package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

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

	@Override
	public SportField findBySportFieldId(Integer Id) {
		Optional<SportField> sportField = sportFieldDao.findById(Id);
		return sportField.get();
	}

	@Override
	public List<SportField> findSportFeildByOwner(Integer id) {
		return sportFieldDao.findSportFieldByOwner(id);
	}

}
