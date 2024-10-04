package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dao.CategoryFieldDAO;
import mapogo.entity.CategoryField;
import mapogo.service.CategoryFieldService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class CategoryFieldRestController {

	@Autowired
	CategoryFieldService categoryFieldService;
	
	@GetMapping("/category_field")
	public List<CategoryField> getAll() {
		return categoryFieldService.findAll();
	}
	
}
