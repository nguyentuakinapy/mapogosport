package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.ProductDetailDAO;
import mapogo.entity.ProductDetail;
import mapogo.service.ProductDetailService;

@Service
public class ProductDetailServiceImpl implements ProductDetailService{
	@Autowired
	ProductDetailDAO detailDAO;
	
	@Override
	public List<ProductDetail> findAll() {
		// TODO Auto-generated method stub
		return detailDAO.findAll();
	}

	@Override
	public List<ProductDetail> findById(Integer id) {
		return detailDAO.findByIdProduct(id);
	}
	
}
