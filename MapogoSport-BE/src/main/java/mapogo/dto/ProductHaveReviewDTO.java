package mapogo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductHaveReviewDTO {
    Integer productId;
    Double averageRating;
    Long ratingCount;
}
