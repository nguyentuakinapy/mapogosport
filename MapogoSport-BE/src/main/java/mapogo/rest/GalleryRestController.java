package mapogo.rest;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.RestController;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import mapogo.dao.GalleryDAO;
import mapogo.entity.Gallery;
import mapogo.service.GalleryService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/gallery")
public class GalleryRestController {
	@Autowired
	GalleryService galleryService;
	@Autowired
	GalleryDAO galleryDAO;
	@Autowired
	private Cloudinary cloudinary;

	@GetMapping
	public List<Gallery> findAll() {
		return galleryService.findAll();
	}

	@GetMapping("/{productDetailId}")
	public List<Gallery> findGalleryByProductDetailId(@PathVariable Integer productDetailId) {
		return galleryService.findGalleryByProductDetailId(productDetailId);
	}

	@DeleteMapping("/delete/{galleryId}")
	public ResponseEntity<?> deleteGalleryById(@PathVariable Integer galleryId) {
		try {
			Optional<Gallery> galleryOptional = galleryDAO.findById(galleryId);

			if (galleryOptional.get() == null) {
				System.err.println("không tìm thấy gallery này");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Gallery not found.");
			} else {
				String oldImagePath = galleryOptional.get().getName();

				// Xóa ảnh nếu tồn tại
				if (oldImagePath != null && !oldImagePath.isEmpty()) {
					// Lấy ID ảnh cũ từ URL
					String publicId = oldImagePath.substring(oldImagePath.lastIndexOf("/") + 1,
							oldImagePath.lastIndexOf("."));
					System.err.println("publicId of image: " + publicId);
					try {
						// Xóa ảnh cũ trên Cloudinary
						cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
						System.err.println("Đã xóa ảnh cũ: " + oldImagePath);
					} catch (IOException e) {
						System.err.println(
								"Không thể xóa ảnh cũ trên Cloudinary: " + oldImagePath + ". Lỗi: " + e.getMessage());
					}
				}
				galleryService.deleteById(galleryId);
				return ResponseEntity.ok().body("Hình ảnh gallery đã được xóa thành công.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi xóa Gallery.");
		}
	}

}
