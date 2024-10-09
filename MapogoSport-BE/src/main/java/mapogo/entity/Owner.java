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
@Table(name = "Owners")
public class Owner implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "OwnerId", nullable = false, unique = true)
	private Integer ownerId;

	@ManyToOne
	@JoinColumn(name = "Username", nullable = false)
	private User user;

	@Column(name = "BankAccount")
	private String bankAccount;

	@Column(name = "MomoAccount")
	private String momoAccount;

	@Column(name = "VnpayAccount")
	private String vnpayAccount;

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<SportField> sportsFields;

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<BlogPost> blogPosts;

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Booking> bookings;
}
