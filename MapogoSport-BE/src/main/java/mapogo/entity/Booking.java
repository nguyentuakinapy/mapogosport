package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Bookings")
public class Booking implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingId", nullable = false, unique = true)
    private Integer bookingId;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date", nullable = false)
    private Date date = new Date();

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    private User user;

    @Column(name = "TotalAmount", nullable = false)
    private double totalAmount;

    @Column(name = "Status", nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "PaymentMethodId", nullable = false)
    @JsonManagedReference
    private PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name = "OwnerId", nullable = false)
    private Owner owner;
    
    @ManyToOne
    @JoinColumn(name = "VoucherId", nullable = false)
    @JsonManagedReference
    private Voucher voucher;

	@Column(name = "Note")
    private String note;

	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
	private List<BookingPayment> bookingPayments;

	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<BookingDetail> bookingDetails;
	
}

