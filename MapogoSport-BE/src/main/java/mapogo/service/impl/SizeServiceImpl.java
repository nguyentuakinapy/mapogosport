package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.SizeDAO;
import mapogo.entity.Product;
import mapogo.entity.Size;
import mapogo.service.SizeService;

@Service
public class SizeServiceImpl implements SizeService{
	@Autowired
	SizeDAO sizeDAO;
	
	@Override
	public List<Size> findAll() {
		// TODO Auto-generated method stub
		return sizeDAO.findAll();
	}

	@Override
	public Size create(Size size) {
		// TODO Auto-generated method stub
		return sizeDAO.save(size);
	}

	@Override
	public Size update(Size size) {
        Optional<Size> existingSize = sizeDAO.findById(size.getSizeId());
        if (existingSize.isPresent()) {
            return sizeDAO.save(size);  // Save will update if the product already exists
        }
        throw new RuntimeException("Product not found with id: " + size.getSizeId());
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		sizeDAO.deleteById(id);
		
	}
	@Override
	   public Size findByName(String sizeName) {
	        return sizeDAO.findBySizeName(sizeName); // Dựng hàm này trong repository để tìm theo tên
	    }



	@Override
	public Optional<Size> findById(Integer id) {
		// TODO Auto-generated method stub
		return sizeDAO.findById(id);
	}

}
