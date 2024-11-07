package mapogo.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mapogo.entity.GallerySportField;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SportFieldDTO {
	private int sportFieldId;
    private String name;
    private String address;
    private String opening;
    private String closing;
    private String status;
    private int categoriesField;
    private String image;
    private  String decription;
    private  String owner;
}
