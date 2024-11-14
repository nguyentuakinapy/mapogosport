package mapogo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mapogo.entity.Product;
import mapogo.entity.User;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewDTO {
	private Integer productReviewId;
	private Integer productId;
	private String userName;
	private Integer rating;
	private String comment;
	private LocalDateTime datedAt;
}
