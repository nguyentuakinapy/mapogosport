package mapogo.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import mapogo.dao.GallerySportFieldDAO;
import mapogo.entity.Gallery;
import mapogo.entity.GallerySportField;
import mapogo.entity.SportField;
import mapogo.service.GallerySportFieldService;

@Service
//Mỵ
public class GallerySportFieldServiceImpl implements GallerySportFieldService {
	@Autowired
	private Cloudinary cloudinary;
	@Autowired
	GallerySportFieldDAO dao;
	
	@Override
	public GallerySportField create(MultipartFile gallery, SportField sportField) {
		GallerySportField item = new GallerySportField();
		item.setSportField(sportField);
		if (!gallery.isEmpty()) {
			// Upload ảnh lên Cloudinary
			Map<String, Object> uploadResult;
			try {
				uploadResult = cloudinary.uploader().upload(gallery.getBytes(),
						ObjectUtils.emptyMap());
				// Lấy URL của ảnh từ kết quả upload
			String imageUrl = (String) uploadResult.get("secure_url");
			System.err.println("Uploaded image URL: " + imageUrl);
			item.setImage(imageUrl); // Lưu URL vào cơ sở dữ liệu

			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return dao.save(item);
	}

	@Override
	public List<GallerySportField> findBySportFieldId(Integer id) {
		return dao.findSportFieldId(id);
	}

	@Override
	public Boolean deleteGalleryById(int gallerySportFieldId) {
		Optional<GallerySportField> galleryOptional = dao.findById(gallerySportFieldId);
	    
	    if (galleryOptional.isPresent()) {
	        dao.delete(galleryOptional.get());
	        return true; 
	    } else {
	        return false; 
	    }	}
}
