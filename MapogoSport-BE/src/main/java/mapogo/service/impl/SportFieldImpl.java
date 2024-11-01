package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.SportFieldDAO;
import mapogo.dto.SportFieldDTO;
import mapogo.entity.CategoryField;
import mapogo.entity.Owner;
import mapogo.entity.SportField;
import mapogo.service.CategoryFieldService;
import mapogo.service.OwnerService;
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
	public List<SportField> findSportFieldByOwner(Integer id) {
		return sportFieldDao.findSportFieldByOwner(id);
	}
	@Autowired
	CategoryFieldService cateService;
	@Autowired
	OwnerService ownerService;
	
	@Override
	public SportField create(SportFieldDTO sportFieldDTO) {
		SportField sportField = new SportField();
		sportField.setName(sportFieldDTO.getName());
		sportField.setAddress(sportFieldDTO.getAddress());
		sportField.setOpening(sportFieldDTO.getOpening());
		sportField.setClosing(sportFieldDTO.getClosing());
		CategoryField cate = cateService.findById(sportFieldDTO.getCategoriesField());
		sportField.setCategoriesField(cate);
		sportField.setQuantity(0);
		sportField.setStatus(sportFieldDTO.getStatus());
		sportField.setImage(sportFieldDTO.getImage());
		Owner owner = ownerService.findByUsername(sportFieldDTO.getOwner());
		sportField.setOwner(owner);
		sportField.setDecription(sportFieldDTO.getDecription());

		return sportFieldDao.save(sportField);
	}

}
