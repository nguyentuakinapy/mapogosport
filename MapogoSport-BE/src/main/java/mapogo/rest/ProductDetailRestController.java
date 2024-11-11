package mapogo.rest;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import mapogo.dao.ProductDAO;
import mapogo.dao.ProductDetailDAO;
import mapogo.dto.ProductDetailDTO;
import mapogo.entity.Gallery;
import mapogo.entity.Product;
import mapogo.entity.ProductDetail;
import mapogo.entity.ProductDetailSize;
import mapogo.service.CartService;
import mapogo.service.GalleryService;
import mapogo.service.OrderDetailService;
import mapogo.service.ProductDetailService;
import mapogo.service.ProductService;
import mapogo.utils.CloudinaryUtils;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class ProductDetailRestController {
	@Autowired
	ProductDetailService productDetailService;
	@Autowired
	private Cloudinary cloudinary;
	@Autowired
	ObjectMapper objectMapper;
	@Autowired
	ProductService productService;
	@Autowired
	ProductDetailDAO detailDAO;
	@Autowired
	GalleryService galleryService;
	@Autowired
	CartService cartService;
	@Autowired
	OrderDetailService orderDetailService;
	@Autowired
	ProductDetailDAO productDetailDAO;
	@Autowired
	CloudinaryUtils cloudinaryUtils;
	@Autowired
	ProductDAO productDAO;

	@GetMapping("/product-detail")
	public List<ProductDetail> findAll() {
		return productDetailService.findAll();
	}
	
    
	@GetMapping("/product-detail/{id}")
	public List<ProductDetail> findById(@PathVariable Integer id) {
		
		return productDetailService.findById(id);
	}
	

	@GetMapping("/product-detail/color/{idProduct}")
	public List<Object[]> selectColorByProductId(@PathVariable Integer idProduct) {
		return productDetailService.selectColorByProductId(idProduct);
	}

	@GetMapping("/product-detail/size/{productDetailId}")
	public List<ProductDetailSize> selectSizeByIdProductDetail(@PathVariable Integer productDetailId) {
		return productDetailService.selectSizeByIdProductDetail(productDetailId);
	}

	@GetMapping("/product-detail/price-by-size/{productDetailId}/{sizeId}")
	public Optional<Double> findPriceByProductDetailIdAndSizeId(@PathVariable Integer productDetailId,
			@PathVariable Integer sizeId) {
		return productDetailService.findPriceByProductDetailIdAndSizeId(productDetailId, sizeId);
	}

	@GetMapping("/product-detail/image/gallery/{productDetailId}")
	public List<Object[]> findByImageDetailAndGalleryByIdProductDetail(@PathVariable Integer productDetailId) {
		return productDetailService.findByImageDetailAndGalleryByIdProductDetail(productDetailId);
	}

	@GetMapping("/cmm/{id}")
	public Integer fine(@PathVariable Integer id) {
	    return productDetailDAO.findProductIdByProductDetailId(id);
	}


//	@GetMapping("/product-detail/demo/{productDetailId}")
//	public Optional<ProductDetail> demo(@PathVariable Integer productDetailId){
//		return productDetailService.findByIdProduct(productDetailId);
//	}

	// >>>>>>>>>>>>>>> Thêm màu sản phẩm chi tiết
	@PostMapping("/product-detail/create/{productId}")
	public ResponseEntity<?> addProductDetail(@PathVariable Integer productId,
			@RequestParam("productDetail") String productDetailJson, @RequestParam("fileimage") MultipartFile file,
			@RequestParam("galleryFiles") MultipartFile[] galleryFiles) {
		try {
	        System.err.println("Tên file ảnh chính (fileimage): lần đầu " + file.getOriginalFilename());

			
			ProductDetailDTO productDetailDTO = objectMapper.readValue(productDetailJson, ProductDetailDTO.class);
			
			ProductDetail productDetail = new ProductDetail();

			
			// Kiểm tra nếu sản phẩm có tồn tại
			Optional<Product> productOptional = productService.findById(productId);
			if (!productOptional.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product không tồn tại thằng chó");
			}
	        productDetail.setColor(productDetailDTO.getColor());
			// Xử lý lưu hình ảnh chính (fileimage)
			if (!file.isEmpty()) {
				
		        System.err.println("Tên file ảnh chính (fileimage): " + file.getOriginalFilename());
				String imageUrl = cloudinaryUtils.uploadImage(file);
				System.err.println("Uploaded image URL: " + imageUrl);

				productDetail.setImage(imageUrl);
			}
			
			// Gán productId vào productDetail nếu cần
			Product productDemo = new Product();
			productDemo.setProductId(productOptional.get().getProductId());
			
			productDetail.setProduct(productDemo);
			// Lưu productDetail vào database trước
		ProductDetail createdProductDetail =	productDetailService.create(productDetail);
		
			// Xử lý lưu gallery
			if (galleryFiles != null) {
				for (MultipartFile galleryFile : galleryFiles) {
					if (!galleryFile.isEmpty()) {
						System.err.println("Uploaded gallery image URL: " + galleryFile.getOriginalFilename()); // img -1
						
						String galleryImageUrl = cloudinaryUtils.uploadImage(galleryFile);
						System.err.println("Uploaded gallery image URL: " + galleryImageUrl);

						// Tạo đối tượng Gallery và gán thông tin
						Gallery gallery = new Gallery();
						gallery.setName(galleryImageUrl);
						gallery.setProductDetail(productDetail); // Gán ProductDetail vào gallery

						// Lưu Gallery vào database
						galleryService.create(gallery);
						System.err.println("Thêm thành công chi tiết ");
					}
				}
			}

			return ResponseEntity.ok(createdProductDetail.getProductDetailId());
		} catch (IOException e) {
			System.err.println("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
		} catch (Exception e) {
			System.err.println("Lỗi khi thêm chi tiết sản phẩm: " + e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Lỗi khi thêm chi tiết sản phẩm: " + e.getMessage());
		}
	}
//	// >>>>>>>>>>>>>>> Thêm màu sản phẩm chi tiết
//	@PostMapping("/product-detail/create/{productId}")
//	public ResponseEntity<?> addProductDetail(@PathVariable Integer productId,
//			@RequestParam("productDetail") String productDetailJson, @RequestParam("fileimage") MultipartFile file,
//			@RequestParam("galleryFiles") MultipartFile[] galleryFiles) {
//		try {
//			// Log thông tin file và productDetail nhận được từ phía frontend
//			
//			// Chuyển đổi chuỗi JSON thành đối tượng ProductDetail
//			ProductDetail productDetail = objectMapper.readValue(productDetailJson, ProductDetail.class);
//			
//			// Kiểm tra nếu sản phẩm có tồn tại
//			Optional<Product> productOptional = productService.findById(productId);
//			if (!productOptional.isPresent()) {
//				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product không tồn tại thằng chó");
//			}
//			
//			// Xử lý lưu hình ảnh chính (fileimage)
//			if (!file.isEmpty()) {
//				// Upload ảnh lên Cloudinary
////				Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
////						ObjectUtils.emptyMap());
//				// Lấy URL của ảnh từ kết quả upload
////				String imageUrl = (String) uploadResult.get("secure_url");
//				
//				String imageUrl = cloudinaryUtils.uploadImage(file);
//				System.err.println("Uploaded image URL: " + imageUrl);
//				
//				// Cập nhật đường dẫn hình ảnh vào productDetail
//				productDetail.setImage(imageUrl);
//			}
//			
//			// Gán productId vào productDetail nếu cần
//			Product productDemo = new Product();
//			productDemo.setProductId(productId);
//			productDetail.setProduct(productDemo);
//			System.err.println("productDetail have id product is: " + productDetail.getProduct().getProductId());
//			
//			// Lưu productDetail vào database trước
//			ProductDetail createdProductDetail =	productDetailService.create(productDetail);
//			
//			// Xử lý lưu gallery
//			if (galleryFiles != null) {
//				for (MultipartFile galleryFile : galleryFiles) {
//					if (!galleryFile.isEmpty()) {
//						// Upload từng ảnh trong gallery lên Cloudinary
//						//	Map<String, Object> galleryUploadResult = cloudinary.uploader().upload(galleryFile.getBytes(),
//						//		ObjectUtils.emptyMap());
//						//String galleryImageUrl = (String) galleryUploadResult.get("secure_url");
//						String galleryImageUrl = cloudinaryUtils.uploadImage(file);
//						System.err.println("Uploaded gallery image URL: " + galleryImageUrl);
//						
//						// Tạo đối tượng Gallery và gán thông tin
//						Gallery gallery = new Gallery();
//						gallery.setName(galleryImageUrl);
//						gallery.setProductDetail(productDetail); // Gán ProductDetail vào gallery
//						
//						// Lưu Gallery vào database
//						galleryService.create(gallery);
//						System.err.println("Thêm thành công chi tiết ");
//					}
//				}
//			}
//			
//			return ResponseEntity.ok(createdProductDetail.getProductDetailId());
//		} catch (IOException e) {
//			System.err.println("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
//		} catch (Exception e) {
//			System.err.println("Lỗi khi thêm chi tiết sản phẩm: " + e);
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("Lỗi khi thêm chi tiết sản phẩm: " + e.getMessage());
//		}
//	}
	  public void updateProductStockByProductId(Integer productId) {
	        Integer totalQuantity = productDAO.getTotalQuantityByProductId(productId);
	        Product product = productDAO.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
	        product.setStock(totalQuantity != null ? totalQuantity : 0);
	        if(product.getStock() == 0) {
	        	product.setStatus("Hết hàng");
	        }else {
	        	product.setStatus("Còn hàng");
	        }
	        productDAO.save(product);
	    }
	@DeleteMapping("/product-detail/delete/{productDetailId}")
	public ResponseEntity<?> deleteProductDetail(@PathVariable Integer productDetailId) {
	    try {
	    	System.err.println("productDetailId "+productDetailId);
	        // Kiểm tra nếu ProductDetail có tồn tại
	        Optional<ProductDetail> productDetailOptional = productDetailDAO.findById(productDetailId);
	        	
	        if (!productDetailOptional.isPresent()) {
	        	System.err.println("Không tồn tại productDetailOptional");
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ProductDetail không tồn tại");
	        }
//	        System.err.println("");

	        ProductDetail productDetail = productDetailOptional.get();

	        // Lấy đường dẫn ảnh từ ProductDetail
	        String oldImagePath = productDetail.getImage();

	        // Xóa ảnh của ProductDetail trên Cloudinary nếu tồn tại
	        if (oldImagePath != null && !oldImagePath.isEmpty()) {
	            String publicId = oldImagePath.substring(oldImagePath.lastIndexOf("/") + 1, oldImagePath.lastIndexOf("."));
	            try {
//	                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
//	            	Xóa ảnh từ cloundary
	            	cloudinaryUtils.deleteImage(publicId);
	            	
	                System.err.println("Đã xóa ảnh của ProductDetail: " + oldImagePath);
	            } catch (IOException e) {
	                System.err.println("Không thể xóa ảnh trên Cloudinary: " + e.getMessage());
	            }
	        }

	        // Xóa tất cả các bản ghi Gallery liên quan đến ProductDetail
	        productDetail.getGalleries().forEach(gallery -> {
	            String galleryImagePath = gallery.getName();
	            if (galleryImagePath != null && !galleryImagePath.isEmpty()) {
	                String galleryPublicId = galleryImagePath.substring(galleryImagePath.lastIndexOf("/") + 1, galleryImagePath.lastIndexOf("."));
	                try {
//	                    cloudinary.uploader().destroy(galleryPublicId, ObjectUtils.emptyMap());
	                    cloudinaryUtils.deleteImage(galleryPublicId);
	                	System.err.println("Đã xóa ảnh trong Gallery: " + galleryImagePath);
	                } catch (IOException e) {
	                    System.err.println("Không thể xóa ảnh trong Gallery trên Cloudinary: " + e.getMessage());
	                }
	            }
	            galleryService.deleteById(gallery.getGalleryId());
	        });

	        // Xóa các bản ghi Cart và OrderDetail liên quan đến ProductDetail
//	        cartService.deleteByProductDetailId(productDetailId);
//	        orderDetailService.deleteByProductDetailId(productDetailId);

	        // Xóa ProductDetail khỏi database
	        System.err.println("productDetailId sẽ xóa "+productDetailId);
	        
            Integer productDetailGetId = productDetailDAO.findProductIdByProductDetailId(productDetailId);
         
	        productDetailService.delete(productDetailId);
	        
	        if (productDetailGetId != null ) {
                updateProductStockByProductId(productDetailGetId);
            } else {
                System.err.println("Sản phẩm không tồn tại");
            }
	        
	        return ResponseEntity.ok("Xóa thành công ProductDetail và các bản ghi liên quan cùng hình ảnh.");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi xóa ProductDetail.");
	    }
	}
	


	@PutMapping("/product-detail/update/{productDetailId}")
	public ResponseEntity<?> updateProductDetail(
	        @PathVariable Integer productDetailId,
	        @RequestParam("productDetail") String productDetailJson,
	        @RequestParam(value = "fileimage", required = false) MultipartFile file,
	        @RequestParam(value = "galleryFiles", required = false) MultipartFile[] galleryFiles) {
	    try {
	        System.err.println("Start updating ProductDetail with ID: " + productDetailId);

	        // Kiểm tra nếu ProductDetail có tồn tại
	        Optional<ProductDetail> existingProductDetailOptional = productDetailDAO.findById(productDetailId);
	        if (!existingProductDetailOptional.isPresent()) {
	            System.err.println("ProductDetail không tồn tại với ID: " + productDetailId);
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ProductDetail không tồn tại");
	        }

	        // Chuyển đổi chuỗi JSON thành đối tượng ProductDetailDTO
	        ProductDetailDTO updatedProductDetailDTO = objectMapper.readValue(productDetailJson, ProductDetailDTO.class);
	        ProductDetail existingProductDetail = existingProductDetailOptional.get();

	        // Cập nhật color từ updatedProductDetailDTO nếu có
	        if (updatedProductDetailDTO.getColor() != null && !updatedProductDetailDTO.getColor().isEmpty()) {
	            existingProductDetail.setColor(updatedProductDetailDTO.getColor());
	            System.err.println("Cập nhật màu sắc của ProductDetail thành: " + updatedProductDetailDTO.getColor());
	        } else {
	            System.err.println("Giữ lại màu cũ của ProductDetail.");
	        }

	        // Cập nhật hình ảnh chính nếu có hình ảnh mới được cung cấp
	        if (file != null && !file.isEmpty()) {
	            System.err.println("Hình ảnh chính được tải lên mới. Đang xử lý cập nhật hình ảnh.");
	            String oldImagePath = existingProductDetail.getImage();
	            if (oldImagePath != null && !oldImagePath.isEmpty()) {
	                String publicId = oldImagePath.substring(oldImagePath.lastIndexOf("/") + 1, oldImagePath.lastIndexOf("."));
	                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
	                System.err.println("Đã xóa hình ảnh cũ với publicId: " + publicId);
	            }

	            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
	            String imageUrl = (String) uploadResult.get("secure_url");
	            existingProductDetail.setImage(imageUrl);
	            System.err.println("Đã cập nhật hình ảnh mới cho ProductDetail với URL: " + imageUrl);
	        }

	        // Thêm ảnh vào Gallery nếu có file được tải lên
	        if (galleryFiles != null) {
	            System.err.println("Đang xử lý các hình ảnh trong Gallery.");
	            for (MultipartFile galleryFile : galleryFiles) {
	                if (!galleryFile.isEmpty()) {
	                    Map<String, Object> galleryUploadResult = cloudinary.uploader().upload(galleryFile.getBytes(), ObjectUtils.emptyMap());
	                    String galleryImageUrl = (String) galleryUploadResult.get("secure_url");

	                    Gallery gallery = new Gallery();
	                    gallery.setName(galleryImageUrl);
	                    gallery.setProductDetail(existingProductDetail);

	                    galleryService.create(gallery);
	                    System.err.println("Đã thêm hình ảnh vào Gallery với URL: " + galleryImageUrl);
	                }
	            }
	        }

	        // Cập nhật ProductDetail trong database
	        productDetailService.update(existingProductDetail);
	        System.err.println("Đã cập nhật ProductDetail trong database.");

	        return ResponseEntity.ok("Cập nhật ProductDetail thành công");

	    } catch (IOException e) {
	        System.err.println("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
	    } catch (Exception e) {
	        System.err.println("Lỗi khi cập nhật ProductDetail: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Lỗi khi cập nhật ProductDetail: " + e.getMessage());
	    }
	}



}
