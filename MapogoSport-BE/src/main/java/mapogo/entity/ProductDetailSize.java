package mapogo.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Sizes")
public class ProductDetailSize implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ProductDetailSizeId")
	private int productDetailSizeId;

	@ManyToOne
	@JoinColumn(name = "ProductDetailId")
	private ProductDetail productDetail;
	
	@ManyToOne
	@JoinColumn(name = "SizeId")
	private Size size;
	
	@Column(name = "Price", nullable = false)
	private Double price;
	
	@Column(name = "Quantity", nullable = false)
	private Integer quantity;
}
