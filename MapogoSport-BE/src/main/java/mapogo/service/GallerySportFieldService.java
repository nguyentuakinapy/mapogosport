package mapogo.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import mapogo.entity.GallerySportField;
import mapogo.entity.SportField;
//Mỵ
public interface GallerySportFieldService {
	GallerySportField create(MultipartFile gallery, SportField sportField);
	
	List<GallerySportField> findBySportFieldId(Integer id);
	
	Boolean deleteGalleryById(int gallerySportFieldId);
}
