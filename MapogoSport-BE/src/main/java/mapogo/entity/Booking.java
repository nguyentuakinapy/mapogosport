package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

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
    private int bookingId;

    @Temporal(TemporalType.DATE)
    @Column(name = "Date", nullable = false)
    private Date date = new Date();

    @Column(name = "StartTime", nullable = false)
    private LocalTime startTime;

    @Column(name = "EndTime", nullable = false)
    private LocalTime endTime;

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "SportFielDetail", nullable = false)
    private SportFielDetail sportFielDetail;

    @Column(name = "TotalAmount", nullable = false)
    private double totalAmount;

    @Column(name = "Status", nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "PaymentMethodId", nullable = false)
    private PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name = "OwnerId", nullable = false)
    private Owner owner;
    
    @ManyToOne
    @JoinColumn(name = "VoucherId", nullable = false)
    private Voucher voucher;

	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
	private List<BookingPayment> bookingPayments;

}

