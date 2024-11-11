package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.Size;

public interface SizeService {

	List<Size> findAll();
	Optional<Size> findById(Integer id);
	Size create(Size size);
	Size update(Size size);
	void deleteById(Integer id);
	Size findByName (String size);
	
}
