package mapogo.rest;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.util.StringUtils;


import mapogo.entity.CategoryProduct;
import mapogo.entity.Product;
import mapogo.service.CategoryProductService;
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
	
    private static final String IMAGE_DIRECTORY = "src/main/resources/static/images/product-images/";

	@GetMapping()
	public List<Product> findAll()
	{
		return productService.findAll();
	}
	
	@GetMapping("/{id}")
	public Optional<Product> findById(@PathVariable Integer id) { // Thêm @PathVariable
		return productService.findById(id); // Sửa lại tên phương thức
	}
	   // Hàm hỗ trợ lấy phần mở rộng của file
    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int dotIndex = fileName.lastIndexOf('.');
        return dotIndex == -1 ? "" : fileName.substring(dotIndex + 1);
    }

    @PostMapping
    public Product createProduct(@RequestPart("product") String productJson, @RequestPart("fileimage") MultipartFile image) {
        try {
            // Chuyển đổi chuỗi JSON thành đối tượng Product
            ObjectMapper objectMapper = new ObjectMapper();
            Product product = objectMapper.readValue(productJson, Product.class);

            System.err.println("Received fileimage: " + image);
            System.err.println("Received product: " + product);
            
        	

            // Lấy đối tượng CategoryProduct từ cơ sở dữ liệu
            if (product.getCategoryProduct() != null && product.getCategoryProduct().getCategoryProductId() != null) {
                Optional<CategoryProduct> categoryProduct = categoryProductService.findById(product.getCategoryProduct().getCategoryProductId());
                product.setCategoryProduct(categoryProduct.get());
            }

            product.setCreateDate(new Date());
            
         // Định dạng ngày tạo thành chuỗi không có ký tự đặc biệt
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
            String formattedDate = dateFormat.format(product.getCreateDate());
            
            // Xử lý và lưu file ảnh
            if (!image.isEmpty()) {
            	 String fileName = StringUtils.cleanPath(RemoveSpaceUtils.removeVietnameseAccent(product.getName().toLowerCase()) 
                         + "_" + formattedDate 
                         + "." + getFileExtension(image.getOriginalFilename()));
                Path imagePath = Paths.get(IMAGE_DIRECTORY, fileName);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, image.getBytes());
                System.err.println("imagePath: "+imagePath);
                product.setImage(fileName); // Lưu tên file ảnh trong cơ sở dữ liệu
            }
            System.err.println("Sản phẩm: " + product);
        	System.err.println("ID: " + product.getProductId()); // null
        	System.err.println("Tên sản phẩm: " + product.getName());
            System.err.println("Danh mục: " + product.getCategoryProduct() != null ? product.getCategoryProduct().getName() : "Loại hàng: null");
        	System.err.println("Mô tả: " + product.getDescription());
        	System.err.println("Trạng thái: " + product.getStatus()); // chưa có
        	System.err.println("Ngày tạo: " + product.getCreateDate());
        	System.err.println("Thương hiệu: " + product.getBrand());
        	System.err.println("Xuất xứ: " + product.getCountry());
        	System.err.println("Hình ảnh: " + product.getImage());
        	System.err.println("Tồn kho: " + product.getStock());

            Product createdProduct = productService.create(product);
            return createdProduct;

        } catch (IOException e) {
            System.err.println("Lỗi khi lưu ảnh sản phẩm: " + e.getMessage());
            return null;
        }
    }

    // PUT: Cập nhật sản phẩm
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        product.setProductId(id);
        try {
            Product updatedProduct = productService.update(product);
            System.err.println("Cập nhật sản phẩm thành công: " + updatedProduct);
            return updatedProduct;
        } catch (RuntimeException e) {
            System.err.println("Không thể cập nhật sản phẩm với ID " + id + ": " + e.getMessage());
            return null;
        }
    }

    // DELETE: Xóa sản phẩm theo ID
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteById(id);
            System.err.println("Đã xóa sản phẩm với ID " + id + " thành công.");
            return "Sản phẩm đã được xóa";
        } catch (RuntimeException e) {
            System.err.println("Không thể xóa sản phẩm với ID " + id + ": " + e.getMessage());
            return "Xóa sản phẩm thất bại";
        }
    }
}
