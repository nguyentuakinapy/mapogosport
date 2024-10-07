package mapogo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.CategoryProductDAO;
import mapogo.entity.CategoryProduct;

@Service
public class CategoryServiceImpl implements CategoryProductService{
	@Autowired
	CategoryProductDAO categoryProductDAO;
	
	@Override
	public List<CategoryProduct> findAll() {
		// TODO Auto-generated method stub
		return categoryProductDAO.findAll();
	}

	@Override
	public Optional<CategoryProduct> findById(Integer id) {
		// TODO Auto-generated method stub
		return categoryProductDAO.findById(id);
	}

}
