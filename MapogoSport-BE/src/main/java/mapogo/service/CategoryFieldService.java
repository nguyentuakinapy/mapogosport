package mapogo.service;

import java.util.List;

import mapogo.entity.CategoryField;

public interface CategoryFieldService {
	List<CategoryField> findAll();
	CategoryField findById(int cate);
}
