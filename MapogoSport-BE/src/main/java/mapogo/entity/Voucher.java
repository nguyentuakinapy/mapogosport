package mapogo.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
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
@Table(name = "Voucher")
public class Voucher implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "VoucherId")
	private Integer voucherId;

	@Column(name = "Name", nullable = false)
	private String name;

	@Column(name = "DiscountPercent", nullable = false)
	private Integer discountPercent;

	@Column(name = "Quantity", nullable = false)
	private Integer quantity;

	@Temporal(TemporalType.DATE)
	@Column(name = "CreateDate", nullable = false)
	private Date createDate = new Date();

	@Temporal(TemporalType.DATE)
	@Column(name = "EndDate", nullable = false)
	private Date endDate = new Date();

	@ManyToOne
	@JoinColumn(name = "CreatedBy", nullable = false)
	@JsonIgnore
	private User user;

	@Column(name = "Status", nullable = false)
	private String status;

	@Column(name = "discountCode", nullable = false)
	private String discountCode;

	@Temporal(TemporalType.DATE)
	@Column(name = "ActiveDate", nullable = false)
	private Date activeDate;

	@OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Order> orders;

	@OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonBackReference
	private List<Booking> bookings;

	@OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<UserVoucher> userVoucher;

}
