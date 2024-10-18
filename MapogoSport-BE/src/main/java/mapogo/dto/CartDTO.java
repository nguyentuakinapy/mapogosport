package mapogo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {

	private Integer cartId;
	private String username;
	private Integer productDetailSizeId;
	private LocalDateTime date;
	private Double totalAmount;
	private Integer quantity;
}
