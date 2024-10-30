package mapogo.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SportFieldDTO {
    private String name;
    private String address;
    private String opening;
    private String closing;
    private String status;
    private int categoriesField;
    private String image;
    private  String decription;
}
