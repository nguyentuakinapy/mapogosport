package mapogo.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
	private Integer productId;

	@Column(name = "Name", nullable = false)
	private String name;

	@ManyToOne
	@JoinColumn(name = "CategoryProductId", nullable = false)
	private CategoryProduct categoryProduct;

	@Column(name = "Decription", nullable = false)
	private String description;

	@Column(name = "Status", nullable = false)
	private String status;

	@Column(name = "CreatedDate", nullable = false)
	private Date createDate;

	@Column(name = "Brand", nullable = false)
	private String brand;

	@Column(name = "Country", nullable = false)
	private String country;

	@Column(name = "Image", nullable = false)
	private String image;

	@Column(name = "Stock", nullable = false)
	private int stock;  // thay đổi thành kiểu int

	
	@Column(name = "Price", nullable = false)
	private Double price;  
	
	@OneToMany(mappedBy = "product")
	@JsonIgnore
	private List<ProductDetail> productDetails;

	@OneToMany(mappedBy = "product")
	@JsonIgnore
	private List<ProductReview> productReviews;

}
