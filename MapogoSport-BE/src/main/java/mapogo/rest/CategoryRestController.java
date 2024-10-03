package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dao.CategoryFieldDAO;
import mapogo.entity.CategoryField;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RequestMapping("/api/category")
@RestController
public class CategoryRestController {

	@Autowired
	CategoryFieldDAO categoryField;
	
	@GetMapping()
	public List<CategoryField> getAll() {
		return categoryField.findAll();
	}
	
}
