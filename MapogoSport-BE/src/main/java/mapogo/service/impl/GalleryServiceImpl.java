package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.GalleryDAO;
import mapogo.entity.Gallery;
import mapogo.service.GalleryService;

@Service
public class GalleryServiceImpl implements GalleryService{
	@Autowired
	GalleryDAO galleryDAO;
	
	@Override
	public List<Gallery> findAll() {
		// TODO Auto-generated method stub
		return galleryDAO.findAll();
	}

	@Override
	public Optional<Gallery> findById(Integer id) {
		// TODO Auto-generated method stub
		return galleryDAO.findById(id);
	}

	@Override
	public Gallery create(Gallery gallery) {
		// TODO Auto-generated method stub
		return galleryDAO.save(gallery);
	}

	@Override
	public Gallery update(Gallery gallery) {
		  Optional<Gallery> existingGallery = galleryDAO.findById(gallery.getGalleryId());
	        if (existingGallery.isPresent()) {
	            return galleryDAO.save(gallery);  // Save will update if the product already exists
	        }
	        throw new RuntimeException("gallery not found with id: " + gallery.getGalleryId());
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		galleryDAO.deleteById(id);
	}  

}
