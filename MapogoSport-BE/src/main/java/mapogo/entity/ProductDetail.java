package mapogo.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "Productdetails")
public class ProductDetail implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ProductDetailId")
	private Integer productDetailId;

	@ManyToOne
	@JoinColumn(name = "ProductId", nullable = false)
	@JsonIgnore
	private Product product;

	@Column(name = "Color", nullable = false)
	private String color;

	@Column(name = "Image", nullable = false)
	private String image;

	@OneToMany(mappedBy = "productDetail", cascade = CascadeType.ALL)
	private List<Gallery> galleries;

	@OneToMany(mappedBy = "productDetail", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<ProductDetailSize> productDetailSizes;
}
