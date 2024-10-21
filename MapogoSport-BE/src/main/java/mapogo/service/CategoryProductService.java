package mapogo.service;

import java.util.List;
import java.util.Optional;

import mapogo.entity.CategoryProduct;

public interface CategoryProductService {
	
	List<CategoryProduct> findAll();
	
	Optional<CategoryProduct> findById(Integer id);
	
	CategoryProduct createCategoryProduct(CategoryProduct categoryProduct);
	
	CategoryProduct updateCategoryProduct(Integer id, CategoryProduct categoryProduct);
	
	void deleteCategoryProduct(Integer id);

	CategoryProduct getCategoryProductById(Integer id);


}
