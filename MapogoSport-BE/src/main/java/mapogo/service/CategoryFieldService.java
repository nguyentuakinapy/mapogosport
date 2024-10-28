package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.CategoryField;


public interface CategoryFieldService {
	List<CategoryField> findAll();
	
	Optional<CategoryField> findById(Integer id);
	
	CategoryField createCategoryField(CategoryField categoryField);
	
	CategoryField updateCategoryField(Integer id, CategoryField categoryField);
	
	void deleteCategoryField(Integer id);

	CategoryField getCategoryFieldById(Integer id);
}
