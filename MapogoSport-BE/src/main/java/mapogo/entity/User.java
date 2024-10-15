package mapogo.entity;

import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Users")
public class User implements Serializable {
	@Id
	@Column(name = "Username", nullable = false)
	private String username;

	@Column(name = "Fullname", nullable = false)
	private String fullname;

	@Column(name = "Password", nullable = false)
	private String password;

	@Column(name = "Enabled", nullable = false)
	private Boolean enabled = true;

	@Temporal(TemporalType.DATE)
	@Column(name = "CreatedAt")
	private Date createdAt = new Date();
	
	@Column(name = "Gender", nullable = true)
	private Integer gender = null;
	
	@Temporal(TemporalType.DATE)
	@Column(name = "Birthday", nullable = true)
	private Date birthday = null;
	
	@Column(name = "Email", nullable = false)
	private String email;
	
	@Column(name = "Avatar", nullable = true)
	private String avatar = null;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<Authority> authorities;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<AddressUser> addressUsers;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Cart> carts;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore//
	private List<ProductReview> productReviews;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<OrderPayment> orderPayments;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Order> orders;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<FieldReview> fieldReviews;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<UserSubscription> subscriptionPayments;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<FavoriteField> favoriteFields;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<UserSubscription> userSubscriptions;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Voucher> vouchers;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<UserVoucher> UserVouchers;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<BookingPayment> bookingPayments;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Booking> bookings;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Owner> owners;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<UserVoucher> UserVoucher;
	
}

