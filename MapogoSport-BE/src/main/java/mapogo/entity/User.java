package mapogo.entity;

import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.List;

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
	private boolean enabled;

	@Temporal(TemporalType.DATE)
	@Column(name = "CreateAt")
	private Date createdAt = new Date();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Authority> authorities;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<AddressUser> addressUsers;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserSubscription> userSubscriptions;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserSubscription> subscriptionPayments;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Booking> bookings;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<BookingPayment> bookingPayments;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<OrderPayment> orderPayments;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Cart> carts;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<FavoriteField> favoriteFields;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<FieldReview> fieldReviews;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ProductReview> productReviews;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Owner> owners;
}
