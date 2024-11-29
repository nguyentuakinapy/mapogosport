package mapogo.rest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.Message;
import mapogo.entity.CategoryProduct;
import mapogo.service.CategoryProductService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/rest/category_product")
@CrossOrigin("*")
@RestController
public class CategoryProductRestController {
	@Autowired
	CategoryProductService categoryProductService;
	@Autowired
	private Cloudinary cloudinary;

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
			@RequestPart("fileImage") MultipartFile file) throws IOException {
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
			Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
			// Lấy URL của ảnh từ kết quả upload
			String imageUrl = (String) uploadResult.get("secure_url");
			categoryProduct.setImage(imageUrl);
		}
		return categoryProductService.createCategoryProduct(categoryProduct);
	}

	@PutMapping("/update/category/product/{id}")
	public CategoryProduct updateCategoryProduct(@PathVariable("id") Integer id,
			@RequestParam("category") String categoryProductJson,
			@RequestPart(value = "fileImage", required = false) MultipartFile file) throws IOException {
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
			// Xóa ảnh cũ nếu tồn tại
			String oldImagePath = existingCategoryProduct.getImage();
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
				existingCategoryProduct.setImage(imageUrl);
			} else {
				categoryProduct.setImage(existingCategoryProduct.getImage());
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
