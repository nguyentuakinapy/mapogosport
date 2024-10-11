package mapogo.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
@Table(name = "Productdetailsize")
public class ProductDetailSize implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ProductDetailSizeId")
	private Integer productDetailSizeId;

	@ManyToOne
	@JoinColumn(name = "ProductDetailId", nullable = false)
	@JsonManagedReference
	private ProductDetail productDetail;

	@ManyToOne
	@JoinColumn(name = "SizeId", nullable = false)
	@JsonManagedReference
	private Size size;

	@Column(name = "Price", nullable = false)
	private Double price;

	@Column(name = "Quantity", nullable = false)
	private int quantity;
	
	@OneToMany(mappedBy = "productDetailSize", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<OrderDetail> orderDetails;
	
	@OneToMany(mappedBy = "productDetailSize", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Cart> carts;
}
