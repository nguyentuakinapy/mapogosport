package mapogo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductDTO {
    private Integer productId;
    private String name;
    private String description;
    private String brand;
    private String country;
    private Double price;
    private String image;
    // Các trường khác nếu cần
}
