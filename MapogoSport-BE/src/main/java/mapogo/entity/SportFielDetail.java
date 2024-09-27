package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SportFielDetail")
public class SportFielDetail implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SportFielDetailId", nullable = false, unique = true)
    private int sportFielDetailId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Price", nullable = false)
    private double price;

    @Column(name = "PeakHourPrices", nullable = false)
    private double peakHourPrices;

    @Column(name = "Size", nullable = false)
    private String size;

    @Column(name = "Status", nullable = false)
    private int status;

    @ManyToOne
    @JoinColumn(name = "SportsFiled", nullable = false)
    private SportField sportsField;

    @Column(name = "PeakHour", nullable = false)
    private String peakHour;

    @OneToMany(mappedBy = "sportFielDetail", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    
}

