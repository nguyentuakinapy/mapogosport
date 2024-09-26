package mapogo.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

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
@Table(name = "Products")
public class Product implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ProductId")
	private Long productId;

	@Column(name = "Name", nullable = false)
	private String name;

	@Column(name = "Price", nullable = false)
	private Double price;

	@ManyToOne
	@JoinColumn(name = "CateoryProductId", nullable = false)
	private CategoryProduct categoryProduct;

	@Column(name = "Description", nullable = false)
	private String description;

	@Column(name = "Status", nullable = false)
	private String status;

	@Column(name = "CreateDate", nullable = false)
	private Date createDate;

	@Column(name = "Brand", nullable = false)
	private String brand;

	@Column(name = "Country", nullable = false)
	private String country;

	@Column(name = "Image", nullable = false)
	private String image;

	@Column(name = "Stock", nullable = false)
	private Double stock;

	@OneToMany(mappedBy = "product")
	private List<ProductDetail> productDetails;

	@OneToMany(mappedBy = "product")
	private List<OrderDetail> orderDetails;

	@OneToMany(mappedBy = "product")
	private List<ProductReview> productReviews;

}
