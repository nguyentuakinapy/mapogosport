package mapogo.rest;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
	@Autowired
	private Cloudinary cloudinary;

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
			@RequestPart("fileImage") MultipartFile file) throws IOException {
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
			Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
			// Lấy URL của ảnh từ kết quả upload
			String imageUrl = (String) uploadResult.get("secure_url");
			System.err.println("Uploaded image URL: " + imageUrl);
			categoryField.setImage(imageUrl);
		}
		return categoryFieldService.createCategoryField(categoryField);
	}

	@PutMapping("/update/category_field/{id}")
	public CategoryField updateCategoryField(@PathVariable("id") Integer id,
			@RequestParam("category") String categoryFieldJson,
			@RequestPart(value = "fileImage", required = false) MultipartFile file) throws IOException {
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
			// Xóa ảnh cũ nếu tồn tại
			String oldImagePath = existingCategoryField.getImage();
			if (oldImagePath != null && !oldImagePath.isEmpty()) {
				// Lấy ID ảnh cũ từ URL
				String publicId = oldImagePath.substring(oldImagePath.lastIndexOf("/") + 1,
						oldImagePath.lastIndexOf("."));
				try {
					// Xóa ảnh cũ trên Cloudinary
					cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
					System.err.println("Đã xóa ảnh cũ: " + oldImagePath);
				} catch (IOException e) {
					System.err.println(
							"Không thể xóa ảnh cũ trên Cloudinary: " + oldImagePath + ". Lỗi: " + e.getMessage());
				}
				// Upload ảnh mới lên Cloudinary
				Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
						ObjectUtils.emptyMap());
				String imageUrl = (String) uploadResult.get("secure_url");
				existingCategoryField.setImage(imageUrl);
			} else {
				categoryField.setImage(existingCategoryField.getImage());
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
