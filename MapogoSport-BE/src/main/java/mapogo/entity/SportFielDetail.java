package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Sportfieldetails")
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
    private String status;

    @Column(name = "PercentDeposit", nullable = false)
    private String percentDeposit;
    
    @ManyToOne
    @JoinColumn(name = "SportFiledId", nullable = false)
    private SportField sportField;

    @Column(name = "PeakHour", nullable = false)
    private String peakHour;


    
}

