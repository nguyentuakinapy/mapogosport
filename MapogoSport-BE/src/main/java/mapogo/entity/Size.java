package mapogo.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

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

	@OneToMany(mappedBy = "size", cascade = CascadeType.ALL)
	@JsonBackReference
	private List<ProductDetailSize> productDetailSizes;
}
