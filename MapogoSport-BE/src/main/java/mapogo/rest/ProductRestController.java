package mapogo.rest;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.util.StringUtils;

import mapogo.dao.ProductDAO;
import mapogo.dao.ProductDetailDAO;
import mapogo.dao.ProductDetailSizeDAO;
import mapogo.entity.CategoryProduct;
import mapogo.entity.Product;
import mapogo.entity.ProductDetail;
import mapogo.entity.ProductDetailSize;
import mapogo.service.CategoryProductService;
import mapogo.service.ProductDetailService;
import mapogo.service.ProductService;
import mapogo.utils.RemoveSpaceUtils;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/products")
public class ProductRestController {
	@Autowired
	ProductService productService;
	@Autowired
	CategoryProductService categoryProductService;
	@Autowired
	private Cloudinary cloudinary;
	@Autowired
	ObjectMapper objectMapper;
//	private static final String IMAGE_DIRECTORY = "src/main/resources/static/images/product-images/";
	
	@Autowired
	ProductDetailService productDetailService;
	@Autowired
	ProductDetailSizeDAO productDetailSizeDAO;
	@Autowired
	ProductDAO productDAO;
	@Autowired
	ProductDetailDAO productDetailDAO;

	@GetMapping()
	public List<Product> findAll() {
		return productService.findAll();
	}
	

    @GetMapping("/page")
    public Page<Product> getProducts(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        return productService.getProducts(page, size);
    }

	@GetMapping("/{id}")
	public Optional<Product> findById(@PathVariable Integer id) { // Thêm @PathVariable
		return productService.findById(id); // Sửa lại tên phương thức
	}

	// Hàm hỗ trợ lấy phần mở rộng của file
	private String getFileExtension(String fileName) {
		if (fileName == null)
			return "";
		int dotIndex = fileName.lastIndexOf('.');
		return dotIndex == -1 ? "" : fileName.substring(dotIndex + 1);
	}

	@PostMapping("/admin/create")
	public ResponseEntity<Integer> createProduct(@RequestPart("product") String productJson,
			@RequestPart("fileimage") MultipartFile image) {
		try {
			System.err.println("productJson "+ productJson);
			// Chuyển đổi chuỗi JSON thành đối tượng Product
			Product product = objectMapper.readValue(productJson, Product.class);

			System.err.println("Received fileimage: " + image);
			System.err.println("Received product: " + product);

			// Lấy đối tượng CategoryProduct từ cơ sở dữ liệu
			if (product.getCategoryProduct() != null && product.getCategoryProduct().getCategoryProductId() != null) {
				Optional<CategoryProduct> categoryProduct = categoryProductService
						.findById(product.getCategoryProduct().getCategoryProductId());
				product.setCategoryProduct(categoryProduct.get());
			}

			product.setCreateDate(new Date());

			// Định dạng ngày tạo thành chuỗi không có ký tự đặc biệt
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
			String formattedDate = dateFormat.format(product.getCreateDate());

			if (!image.isEmpty()) {
				// Upload ảnh lên Cloudinary
				Map<String, Object> uploadResult = cloudinary.uploader().upload(image.getBytes(),
						ObjectUtils.emptyMap());

				// Lấy URL của ảnh từ kết quả upload
				String imageUrl = (String) uploadResult.get("secure_url");
				System.err.println("Uploaded image URL: " + imageUrl);

				// Lưu URL của ảnh vào đối tượng Product
				product.setImage(imageUrl); // Lưu URL vào cơ sở dữ liệu
			}
			System.err.println("Sản phẩm: " + product);
			System.err.println("ID: " + product.getProductId()); // null
			System.err.println("Tên sản phẩm: " + product.getName());
			System.err.println(
					"Danh mục: " + product.getCategoryProduct() != null ? product.getCategoryProduct().getName()
							: "Loại hàng: null");
			System.err.println("Mô tả: " + product.getDescription());
			System.err.println("Trạng thái: " + product.getStatus()); // chưa có

			System.err.println("Ngày tạo: " + product.getCreateDate());
			System.err.println("Thương hiệu: " + product.getBrand());
			System.err.println("Xuất xứ: " + product.getCountry());
			System.err.println("Hình ảnh: " + product.getImage());
			System.err.println("Tồn kho: " + product.getStock());
			System.err.println("Giá tiền: " + product.getPrice());

//			Product createdProduct = productService.create(product);
//			return createdProduct;
			product.setStatus("Hết hàng");
			Product createdProduct = productService.create(product);
			createdProduct.getProductId();
			System.err.println("Id vừa tạo "+createdProduct.getProductId());
	        // Trả về ResponseEntity chứa sản phẩm đã tạo
	        return ResponseEntity.ok(createdProduct.getProductId());

		} catch (IOException e) {
			System.err.println("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
			return null;
		} catch (Exception e) {
			System.err.println("Lỗi khi upload ảnh lên Cloudinary: " + e.getMessage());
			return null;
		}
	}

	@PutMapping("/admin/{id}")
	public Product updateProduct(@PathVariable Integer id, @RequestPart("product") String productJson,
			@RequestPart(value = "fileimage", required = false) MultipartFile image) {
		try {
			// Chuyển đổi chuỗi JSON thành đối tượng Product
			Product product = objectMapper.readValue(productJson, Product.class);
			product.setProductId(id); // Đặt ID cho sản phẩm

			Optional<Product> productOriginal = Optional.ofNullable(productService.findById(id).orElse(null));
			if (productOriginal.isEmpty()) {
				throw new RuntimeException("Sản phẩm không tồn tại.");
			}


			// Lưu lại ngày tạo cũ
			product.setCreateDate(productOriginal.get().getCreateDate());

			// Lấy đối tượng CategoryProduct từ cơ sở dữ liệu
			if (product.getCategoryProduct() != null && product.getCategoryProduct().getCategoryProductId() != null) {
				Optional<CategoryProduct> categoryProduct = categoryProductService
						.findById(product.getCategoryProduct().getCategoryProductId());
				product.setCategoryProduct(categoryProduct.orElse(null));
			}

			// Xử lý và lưu file ảnh mới (nếu có)
			if (image != null && !image.isEmpty()) {
				// Xóa ảnh cũ nếu tồn tại
				String oldImagePath = productOriginal.get().getImage();
				if (oldImagePath != null && !oldImagePath.isEmpty()) {
					// Lấy ID ảnh cũ từ URL
					String publicId = oldImagePath.substring(oldImagePath.lastIndexOf("/") + 1,
							oldImagePath.lastIndexOf("."));
					System.err.println("publicId of image: "+publicId);
					try {
						// Xóa ảnh cũ trên Cloudinary
						cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
						System.err.println("Đã xóa ảnh cũ: " + oldImagePath);
					} catch (IOException e) {
						System.err.println(
								"Không thể xóa ảnh cũ trên Cloudinary: " + oldImagePath + ". Lỗi: " + e.getMessage());
					}
				}

				// Upload ảnh mới lên Cloudinary
				Map<String, Object> uploadResult = cloudinary.uploader().upload(image.getBytes(),
						ObjectUtils.emptyMap());
				String imageUrl = (String) uploadResult.get("secure_url");
				System.err.println("Uploaded image URL: " + imageUrl);

				// Lưu URL của ảnh mới vào đối tượng Product
				product.setImage(imageUrl); // Cập nhật URL ảnh mới vào cơ sở dữ liệu
			} else {
				// Nếu không có ảnh mới, giữ nguyên ảnh cũ
				product.setImage(productOriginal.get().getImage());
			}

			System.err.println("Sản phẩm: " + product);
			System.err.println("ID: " + product.getProductId()); // null
			System.err.println("Tên sản phẩm: " + product.getName());
			System.err.println(
					"Danh mục: " + product.getCategoryProduct() != null ? product.getCategoryProduct().getName()
							: "Loại hàng: null");
			System.err.println("Mô tả: " + product.getDescription());
			System.err.println("Trạng thái: " + product.getStatus()); // chưa có

			System.err.println("Ngày tạo: " + product.getCreateDate());
			System.err.println("Thương hiệu: " + product.getBrand());
			System.err.println("Xuất xứ: " + product.getCountry());
			System.err.println("Hình ảnh: " + product.getImage());
			System.err.println("Tồn kho: " + product.getStock());
			
	       

			System.err.println("Giá tiền: " + product.getPrice());
			 Integer totalQuantity = productDAO.getTotalQuantityByProductId(id);
			 System.err.println("totalQuantity "+totalQuantity);
		        Product productGetTotal = productDAO.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
		        product.setStock(totalQuantity != null ? totalQuantity : 0);
				System.err.println("Tồn kho sau cùng: " + product.getStock());
				if(product.getStock() ==0) {
					product.setStatus("Hết hàng");
				}else {
					product.setStatus("Còn hàng");
				}
				
			// Cập nhật sản phẩm
			Product updatedProduct = productService.update(product);
			System.err.println("Cập nhật sản phẩm thành công: " + updatedProduct);
			return updatedProduct;

		} catch (IOException e) {
			System.err.println("Lỗi khi cập nhật sản phẩm: " + e.getMessage());
			return null;
		} catch (Exception e) {
			System.err.println("Lỗi không xác định: " + e.getMessage());
			return null;
		}
	}
	
	@PutMapping("/{id}/mark-as-out-of-stock")
	public ResponseEntity<Product> markAsOutOfStock(@PathVariable Integer id) {
	    	System.err.println("id nhận đc "+ id);
		try {
	        Optional<Product> productOptional = productService.findById(id);

	        if (productOptional.isEmpty()) {
	        	System.err.println("sản phẩm không tồn tại");
	            throw new RuntimeException("Sản phẩm không tồn tại.");
	        }

	        Product product = productOptional.get();
	        
	        List<ProductDetail> productDetails = product.getProductDetails();

	        // Kiểm tra nếu không có ProductDetail
	        if (productDetails.isEmpty()) {
	            System.err.println("Sản phẩm không có chi tiết sản phẩm.");
	            throw new RuntimeException("Sản phẩm không có chi tiết sản phẩm.");
	        }

	        // Duyệt qua từng ProductDetail và cập nhật số lượng của ProductDetailSize
	        productDetails.forEach(productDetail -> {
	            List<ProductDetailSize> productDetailSizes = productDetail.getProductDetailSizes();
	            productDetailSizes.forEach(size -> {
	                size.setQuantity(0); // Cập nhật số lượng thành 0
	            });
	        });
	        
	        product.setStock(0);
	        product.setStatus("Hết hàng"); // Cập nhật trạng thái thành "Hết hàng"
	        
	        

	        Product updatedProduct = productService.update(product);
	        System.err.println("Cập nhật trạng thái sản phẩm thành công: " + updatedProduct);

	        return ResponseEntity.ok(updatedProduct);
	    } catch (Exception e) {
	        System.err.println("Lỗi khi cập nhật trạng thái sản phẩm: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}

//	   @GetMapping("/jjj/{productId}")
//	    public List<ProductDetail> getProductDetails(@PathVariable Integer productId) {
//	        return productDetailDAO.findByProduct_ProductId(productId);
//	    }

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
		try {
			// Tìm sản phẩm theo ID
			Optional<Product> productOptional = productService.findById(id);
			if (productOptional.isPresent()) {
				Product product = productOptional.get();

				// Lấy đường dẫn ảnh từ sản phẩm
				String oldImagePath = productOptional.get().getImage();

				System.out.println("Path ảnh sản phẩm: " + oldImagePath);

				// Xóa ảnh nếu tồn tại
				if (oldImagePath != null && !oldImagePath.isEmpty()) {
					// Lấy ID ảnh cũ từ URL
					String publicId = oldImagePath.substring(oldImagePath.lastIndexOf("/") + 1,
							oldImagePath.lastIndexOf("."));
					System.err.println("publicId of image: "+publicId);
					try {
						// Xóa ảnh cũ trên Cloudinary
						cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
						System.err.println("Đã xóa ảnh cũ: " + oldImagePath);
					} catch (IOException e) {
						System.err.println(
								"Không thể xóa ảnh cũ trên Cloudinary: " + oldImagePath + ". Lỗi: " + e.getMessage());
					}
				}

				// Xóa sản phẩm khỏi database
				productService.deleteById(id);

				return ResponseEntity.ok().body("Sản phẩm và hình ảnh đã được xóa thành công.");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sản phẩm không tồn tại.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi xóa sản phẩm.");
		}
	}

}
