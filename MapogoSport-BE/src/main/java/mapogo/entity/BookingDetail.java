package mapogo.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
    @Column(name = "BookingDetailId")
    private Integer bookingDetailId;

	@Column(name = "StartTime", nullable = false)
    private String startTime;

    @Column(name = "EndTime", nullable = false)
    private String endTime;
    
    @ManyToOne
    @JoinColumn(name = "SportFieldDetailId", nullable = false)
    private SportFieldDetail sportFieldDetail;
    
    @Column(name = "Price", nullable = false)
    private Double price;
    
    @Column(name = "date")
    private LocalDate date;
    
    @ManyToOne
    @JoinColumn(name = "BookingId", nullable = false)
    @JsonBackReference
    private Booking booking;

}
