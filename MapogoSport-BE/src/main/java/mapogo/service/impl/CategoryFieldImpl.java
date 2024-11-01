package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

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

	@Override
	public CategoryField findById(int cate) {
		return categoryFieldDao.findById(cate).get();
	}

	@Override
	public CategoryField createCategoryField(CategoryField categoryField) {
		// TODO Auto-generated method stub
		return categoryFieldDao.save(categoryField);
	}

	@Override
	public CategoryField updateCategoryField(Integer id, CategoryField categoryField) {
		// TODO Auto-generated method stub
		return categoryFieldDao.save(categoryField);
	}

	@Override
	public void deleteCategoryField(Integer id) {
		// TODO Auto-generated method stub
		categoryFieldDao.deleteById(id);
	}

	@Override
	public CategoryField getCategoryFieldById(Integer id) {
		// TODO Auto-generated method stub
		return categoryFieldDao.findById(id).orElse(null);
	}
	

}
