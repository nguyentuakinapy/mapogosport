package mapogo.rest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.Message;
import mapogo.entity.CategoryProduct;
import mapogo.service.CategoryProductService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/rest")
@CrossOrigin("*")
@RestController
public class CategoryProductRestController {
	@Autowired
	CategoryProductService categoryProductService;

	@GetMapping("/category-products")
	List<CategoryProduct> findAll() {
		return categoryProductService.findAll();
	}

	@GetMapping("/category-products/{id}")
	Optional<CategoryProduct> findCategoryProductById(@PathVariable Integer id) {
		return categoryProductService.findById(id);
	}

	@PostMapping("/create") // create
	public CategoryProduct createCategoryProduct(@RequestParam("category") String categoryProductJson,
			@RequestParam("fileImage") MultipartFile file) {
		// parse categoryProductJson thành đối tượng CategoryProduct
		ObjectMapper objectMapper = new ObjectMapper();
		CategoryProduct categoryProduct;
		try {
			categoryProduct = objectMapper.readValue(categoryProductJson, CategoryProduct.class);
		} catch (Exception e) {
			throw new Error("Có lỗi xảy ra khi chuyển đổi categoryProductJson");
		}
		// resolve file image
		if (!file.isEmpty()) {
			String fileName = file.getOriginalFilename();
			categoryProduct.setImage(fileName);
		}
		return categoryProductService.createCategoryProduct(categoryProduct);
	}

	@PutMapping("/update/{id}")
	public CategoryProduct updateCategoryProduct(@PathVariable("id") Integer id,
			@RequestParam("category") String categoryProductJson,
			@RequestParam(value = "fileImage", required = false) MultipartFile file) {
		// Chuyển từ categoryProductJson thành categoryProduct
		ObjectMapper objectMapper = new ObjectMapper();
		CategoryProduct categoryProduct;
		try {
			categoryProduct = objectMapper.readValue(categoryProductJson, CategoryProduct.class);
		} catch (Exception e) {
			throw new Error("Có lỗi xảy ra khi chuyển đổi categoryProductJson");
		}

		// Lấy thông tin CategoryProduct từ database hiện tại
		CategoryProduct existingCategoryProduct = categoryProductService.getCategoryProductById(id);
		if (existingCategoryProduct == null) {
			throw new Error("Không tìm thấy danh mục với id: " + id);
		}

		// Cập nhật các thuộc tính từ categoryProduct mới vào existingCategoryProduct
		existingCategoryProduct.setName(categoryProduct.getName()); // Hoặc thuộc tính bạn muốn cập nhật

		// Xử lý tệp hình ảnh nếu có
		if (file != null && !file.isEmpty()) {
			try {
				byte[] imageBytes = file.getBytes();
				String base64Image = Base64.getEncoder().encodeToString(imageBytes);
				existingCategoryProduct.setImage(base64Image); // Cập nhật thuộc tính hình ảnh với Base64
			} catch (IOException e) {
				throw new Error("Có lỗi xảy ra khi lưu tệp");
			}
		}

		// Giữ nguyên thông tin ảnh cũ nếu không có tệp mới
		return categoryProductService.updateCategoryProduct(id, existingCategoryProduct);
	}

	@DeleteMapping("/delete/{id}")
	public void deleteCategoryProduct(@PathVariable("id") Integer id) {
		categoryProductService.deleteCategoryProduct(id);
	}
}
