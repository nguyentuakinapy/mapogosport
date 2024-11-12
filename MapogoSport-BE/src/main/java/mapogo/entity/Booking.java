package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(name = "BookingId")
    private Integer bookingId;

    @Column(name = "Date", nullable = false)
    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    @JsonBackReference
    private User user;

    @Column(name = "TotalAmount", nullable = false)
    private double totalAmount;

    @Column(name = "Status", nullable = false)
    private String status = "Đã thanh toán";

    @ManyToOne
    @JoinColumn(name = "PaymentMethodId", nullable = false)
    @JsonBackReference
    private PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name = "OwnerId", nullable = false)
    @JsonManagedReference
    private Owner owner;
    
    @ManyToOne
    @JoinColumn(name = "VoucherId")
    @JsonBackReference
    private Voucher voucher = null;

	@Column(name = "Note")
    private String note = null;

	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference("booking-bookingpayment")
	private List<BookingPayment> bookingPayments;

	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference("booking-bookingdetail")
	private List<BookingDetail> bookingDetails;
	
	@Column(name="FullName")
	private String fullName = null;
	
	@Column(name="PhoneNumber")
	private String phoneNumber = null;
	
	@Column(name="PrepayPrice")
	private double prepayPrice;
	
	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Notification> notifications;
	
	@Transient
    private Map<String, Object> sportFieldInfo;
}

