package mapogo.rest;


import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import mapogo.entity.CategoryField;
import mapogo.service.CategoryFieldService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;


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
	
	@GetMapping("/category_field/{id}")
	public CategoryField findCategoryFieldById(@PathVariable int id) {
		return categoryFieldService.findById(id);
	}
	
	@PostMapping("/create/category_field") // create
	public CategoryField createCategoryField(@RequestParam("category") String categoryFieldJson,
			@RequestParam("fileImage") MultipartFile file) {
		// parse categoryFieldJson thành đối tượng CategoryField
		ObjectMapper objectMapper = new ObjectMapper();
		CategoryField categoryField;
		try {
			categoryField = objectMapper.readValue(categoryFieldJson, CategoryField.class);
		} catch (Exception e) {
			throw new Error("Có lỗi xảy ra khi chuyển đổi categoryProductJson");
		}
		// resolve file image
		if (!file.isEmpty()) {
			String fileName = file.getOriginalFilename();
			categoryField.setImage(fileName);
		}
		return categoryFieldService.createCategoryField(categoryField);
	}

	@PutMapping("/update/category_field/{id}")
	public CategoryField updateCategoryField(@PathVariable("id") Integer id,
			@RequestParam("category") String categoryFieldJson,
			@RequestParam(value = "fileImage", required = false) MultipartFile file) {
		// Chuyển từ categoryFieldJson thành categoryField
		ObjectMapper objectMapper = new ObjectMapper();
		CategoryField categoryField;
		try {
			categoryField = objectMapper.readValue(categoryFieldJson, CategoryField.class);
		} catch (Exception e) {
			throw new Error("Có lỗi xảy ra khi chuyển đổi categoryFieldJson");
		}

		// Lấy thông tin CategoryField từ database hiện tại
		CategoryField existingCategoryField = categoryFieldService.getCategoryFieldById(id);
		if (existingCategoryField == null) {
			throw new Error("Không tìm thấy danh mục với id: " + id);
		}

		// Cập nhật các thuộc tính từ categoryField mới vào existingCategoryField
		existingCategoryField.setName(categoryField.getName()); // Hoặc thuộc tính bạn muốn cập nhật

		// Xử lý tệp hình ảnh nếu có
		if (file != null && !file.isEmpty()) {
			try {
				byte[] imageBytes = file.getBytes();
				String base64Image = Base64.getEncoder().encodeToString(imageBytes);
				existingCategoryField.setImage(base64Image); // Cập nhật thuộc tính hình ảnh với Base64
			} catch (IOException e) {
				throw new Error("Có lỗi xảy ra khi lưu tệp");
			}
		}

		// Giữ nguyên thông tin ảnh cũ nếu không có tệp mới
		return categoryFieldService.updateCategoryField(id, existingCategoryField);
	}

	@DeleteMapping("/delete/category_field/{id}")
	public void deleteCategoryField(@PathVariable("id") Integer id) {
		categoryFieldService.deleteCategoryField(id);
	}
	
}
