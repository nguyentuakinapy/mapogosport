package mapogo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mapogo.entity.Size;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductDetailSizeDTO {
	 private Integer productDetailSizeId;
	  private Size size; 
	    private Double price;
	    private int quantity;
}
