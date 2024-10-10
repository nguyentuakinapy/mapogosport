package mapogo.rest;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.CategoryProduct;
import mapogo.entity.Product;
import mapogo.service.CategoryProductService;
import mapogo.service.ProductService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/products")
public class ProductRestController {
	@Autowired
	ProductService productService;
	@Autowired
	CategoryProductService categoryProductService;
	
	@GetMapping()
	public List<Product> findAll()
	{
		return productService.findAll();
	}
	
	@GetMapping("/{id}")
	public Optional<Product> findById(@PathVariable Integer id) { // Thêm @PathVariable
		return productService.findById(id); // Sửa lại tên phương thức
	}
	
	 // POST: Tạo mới sản phẩm
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        try {
        	  // Lấy đối tượng CategoryProduct từ cơ sở dữ liệu
            if (product.getCategoryProduct() != null && product.getCategoryProduct().getCategoryProductId() != null) {
                Optional<CategoryProduct> categoryProduct = categoryProductService.findById(product.getCategoryProduct().getCategoryProductId());
                System.err.println("category product "+ categoryProduct);
                product.setCategoryProduct(categoryProduct.get());
            }else {
            	System.err.println("ko lay đc cate");
            }
        	product.setCreateDate(new Date());
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
            System.err.println("Tạo sản phẩm thành công: " + createdProduct);
            return createdProduct;
        } catch (Exception e) {
            System.err.println("Không thể tạo sản phẩm: " + e.getMessage());
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
