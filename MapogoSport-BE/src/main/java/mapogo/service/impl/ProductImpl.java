package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductDAO;
import mapogo.entity.Product;
import mapogo.service.ProductService;

@Service
public class ProductImpl implements ProductService{
	
	@Autowired
	ProductDAO productDao;

	@Override
	public List<Product> findAll() {
		return productDao.findAll();
	}

	@Override
	public Optional<Product> findById(Integer id) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

}
