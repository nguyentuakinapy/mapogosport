package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Subscriptionpayments")
public class SubscriptionPayment implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "SubscriptionPaymentId", nullable = false, unique = true)
	private Integer subscriptionPaymentId;

	@ManyToOne
	@JoinColumn(name = "Username", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "UserSubscriptionId", nullable = false)
	private UserSubscription userSubscription;

	@ManyToOne
	@JoinColumn(name = "PaymentMethodId")
	private PaymentMethod paymentMethod;

	@Column(name = "Amount", nullable = false)
	private double amount;

	@Column(name = "Status", nullable = false)
	private String status;

	@Temporal(TemporalType.DATE)
	@Column(name = "PaymentDate", nullable = false)
	private Date paymentDate = new Date();

	@Column(name = "ReferenceCode")
	private String referenceCode;

}
