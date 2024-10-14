package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.Gallery;

public interface GalleryService {
	List<Gallery> findAll();
	Optional<Gallery> findById(Integer id);
	Gallery create(Gallery gallery);
	Gallery update(Gallery gallery);
	void deleteById(Integer id);
}
