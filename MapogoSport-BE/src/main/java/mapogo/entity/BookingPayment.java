package mapogo.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
@Table(name = "Bookingpayments")
public class BookingPayment implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "BookingPaymentId")
	private Integer bookingPaymentId;
	
	@ManyToOne
	@JoinColumn(name = "Booking_Id", nullable = false)
	@JsonBackReference
	private Booking booking;

	@Column(name = "Amount", nullable = false)
	private Double amount;

	@Column(name = "Status", nullable = false)
	private String status;

	@Column(name = "Date", nullable = false)
	private LocalDateTime date = LocalDateTime.now();

	@ManyToOne
	@JoinColumn(name = "Username", nullable = false)
	private User user;

	@Column(name = "ReferenceCode")
	private String referenceCode;

}
