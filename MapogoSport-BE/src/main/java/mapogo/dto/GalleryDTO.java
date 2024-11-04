package mapogo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GalleryDTO {
    private Integer galleryId;
    private String imageUrl;
    // Các trường khác nếu cần
}
