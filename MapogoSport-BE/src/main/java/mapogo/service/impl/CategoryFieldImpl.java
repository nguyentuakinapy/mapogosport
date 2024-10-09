package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.CategoryFieldDAO;
import mapogo.entity.CategoryField;
import mapogo.service.CategoryFieldService;

@Service
public class CategoryFieldImpl implements CategoryFieldService{

	@Autowired
	CategoryFieldDAO categoryFieldDao;
	
	@Override
	public List<CategoryField> findAll() {
		return categoryFieldDao.findAll();
	}

}
