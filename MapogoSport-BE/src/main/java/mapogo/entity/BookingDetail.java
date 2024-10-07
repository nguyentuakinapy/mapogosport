package mapogo.entity;

import java.io.Serializable;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "Bookingdetails")
public class BookingDetail implements Serializable{

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingDetailId", nullable = false, unique = true)
    private int bookingId;
	
	@Column(name = "StartTime", nullable = false)
    private LocalTime startTime;

    @Column(name = "EndTime", nullable = false)
    private LocalTime endTime;
    
    @ManyToOne
    @JoinColumn(name = "SportFielDetailId", nullable = false)
    private SportFielDetail sportFielDetail;
    
    @Column(name = "Price", nullable = false)
    private Double price;
    
    @ManyToOne
    @JoinColumn(name = "BookingId", nullable = false)
    private Booking booking;

}
