package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Sizes")
public class Size implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "SizeId", nullable = false)
	private Integer sizeId;

	@Column(name = "SizeName", nullable = false)
	private String sizeName;

	@OneToMany(mappedBy = "size")
    @JsonIgnore
	private List<ProductDetailSize> productDetailSizes;

}
