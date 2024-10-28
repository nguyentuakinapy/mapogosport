package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;

import mapogo.dao.ProductDetailSizeDAO;
import mapogo.dto.ProductDetailSizeDTO;
import mapogo.entity.ProductDetail;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.Size;
import mapogo.service.ProductDetailSizeService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/product-detail-size")
public class ProductDetailSizeRestController {
	@Autowired
	ProductDetailSizeService productDetailSizeService;
	@Autowired
	ObjectMapper objectMapper;
	@Autowired
	ProductDetailSizeDAO productDetailSizeDAO;

	
	@GetMapping
	public List<ProductDetailSize> findAll()
	{
		return productDetailSizeService.findAll();
	}
	
	  // Fetch ProductDetailSize by ProductDetailId
    @GetMapping("/{productDetailId}")
    public List<ProductDetailSize> findByProductDetailId(@PathVariable Integer productDetailId) {
        return productDetailSizeService.findProductDetailSize_By_ProductDetailId(productDetailId);
    }
    
    
    
    @PostMapping("/create/{productDetailId}")
    public ProductDetailSize createProductDetailSize(
            @PathVariable Integer productDetailId, 
            @RequestParam("productDetailSize") String productDetailSizeJson) {
        try {
            // Log đầu vào
            System.err.println("Received productDetailSizeJson: " + productDetailSizeJson);

            // Chuyển đổi dữ liệu JSON thành đối tượng ProductDetailSizeDTO
            ProductDetailSizeDTO productDetailSizeDTO = objectMapper.readValue(productDetailSizeJson, ProductDetailSizeDTO.class);
            System.err.println("Converted to ProductDetailSizeDTO: " + productDetailSizeDTO.toString());

            // Log productDetailId
            System.err.println("ProductDetailId: " + productDetailId); // Id detail
            
            // Tạo đối tượng ProductDetail để gán productDetailId
            ProductDetail productDetail = new ProductDetail();
            productDetail.setProductDetailId(productDetailId);   
            System.err.println("Created ProductDetail with id: " + productDetail.getProductDetailId()); // lấy đc Id product detail
            
            // Chuyển đổi từ ProductDetailSizeDTO sang ProductDetailSize
            ProductDetailSize productDetailSize = new ProductDetailSize();
            productDetailSize.setProductDetail(productDetail);
            
            System.err.println("productDetailSize getProductDetail().getColor(): "+productDetailSize.getProductDetail().getColor());
            System.err.println("productDetailSize getProductDetail().getProductDetailId(): "+productDetailSize.getProductDetail().getProductDetailId());
            
            // Khởi tạo và thiết lập Size
//            Size size = new Size();
//            size.setSizeId(productDetailId);
////            size.setSizeId(1); // demo
//            System.err.println("productDetailSizeDTO.getSizeId() "+productDetailSizeDTO.getSizeId());
//            productDetailSize.setSize(size);
//            System.err.println("Set size with SizeId: " + productDetailSize.getSize().getSizeId());
            // Khởi tạo và thiết lập Size từ DTO
            
            Size size = new Size();
            size.setSizeId(productDetailSizeDTO.getSize() != null ? productDetailSizeDTO.getSize().getSizeId() : null);
            
            // Kiểm tra hợp lệ cho sizeId
            if (size.getSizeId() == null) {
                throw new IllegalArgumentException("Size ID không hợp lệ");
            }
            
            productDetailSize.setSize(size);
            System.err.println("Set size with SizeId: " + productDetailSize.getSize().getSizeId());
            
            
            productDetailSize.setPrice(productDetailSizeDTO.getPrice());
            productDetailSize.setQuantity(productDetailSizeDTO.getQuantity());
            
            // Log thông tin trước khi lưu
            System.err.println("ProductDetailSize details:");
            System.err.println("Quantity: " + productDetailSize.getQuantity());
            System.err.println("ProductDetailId: " + productDetailSize.getProductDetail().getProductDetailId());
            System.err.println("Price: " + productDetailSize.getPrice());
            System.err.println("SizeId: " + productDetailSize.getSize().getSizeId());
            
            // Xác thực productDetailSize trước khi lưu
            if (productDetailSize.getQuantity() <= 0 || productDetailSize.getPrice() < 0) {
                throw new IllegalArgumentException("Số lượng phải lớn hơn 0 và giá phải không âm");
            }
            
            // Lưu ProductDetailSize vào cơ sở dữ liệu
            ProductDetailSize savedProductDetailSize = productDetailSizeService.create(productDetailSize);
            System.err.println("Successfully saved ProductDetailSize with ID: " + savedProductDetailSize.getProductDetailSizeId());
            
            return savedProductDetailSize;
        } catch (Exception e) {
            System.err.println("Error while saving ProductDetailSize: " + e.getMessage());
            // Tùy chọn ném ra một ngoại lệ tùy chỉnh hoặc trả về phản hồi cụ thể
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể tạo ProductDetailSize", e);
        }
    }
    
    @DeleteMapping("/delete/{productDetailSizeId}")
    public ResponseEntity<String> deleteProductDetailSize(@PathVariable Integer productDetailSizeId) {
        try {
            // Kiểm tra xem ProductDetailSize có tồn tại không
            if (!productDetailSizeDAO.existsById(productDetailSizeId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductDetailSize không tồn tại");
            }
            
            // Xóa ProductDetailSize
            productDetailSizeDAO.deleteById(productDetailSizeId);
            return ResponseEntity.ok("ProductDetailSize đã được xóa thành công");
        } catch (Exception e) {
            System.err.println("Error while deleting ProductDetailSize: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể xóa ProductDetailSize", e);
        }
    }
    
    @PutMapping("/update/{productDetailSizeId}")
    public ProductDetailSize updateProductDetailSize(
            @PathVariable Integer productDetailSizeId,
            @RequestParam("productDetailSize") String productDetailSizeJson) {
        try {
            // Chuyển đổi dữ liệu JSON thành đối tượng ProductDetailSizeDTO
            ProductDetailSizeDTO productDetailSizeDTO = objectMapper.readValue(productDetailSizeJson, ProductDetailSizeDTO.class);
            
            // Tìm `ProductDetailSize` từ database
            ProductDetailSize existingProductDetailSize = productDetailSizeDAO.findById(productDetailSizeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductDetailSize không tồn tại"));
            
            // Cập nhật các thuộc tính từ DTO
            existingProductDetailSize.setPrice(productDetailSizeDTO.getPrice());
            existingProductDetailSize.setQuantity(productDetailSizeDTO.getQuantity());
            
            Size size = new Size();
            size.setSizeId(productDetailSizeDTO.getSize() != null ? productDetailSizeDTO.getSize().getSizeId() : null);
            
            existingProductDetailSize.setSize(size);

            // Lưu cập nhật vào database
            ProductDetailSize updatedProductDetailSize = productDetailSizeService.update(existingProductDetailSize);
            return updatedProductDetailSize;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể cập nhật ProductDetailSize", e);
        }
    }


    


}


