package mapogo.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductDetailDTO {
	 private Integer productDetailId;
	    private String color;
	    private String image;
	    private List<ProductDetailSizeDTO> productDetailSizes;
}
