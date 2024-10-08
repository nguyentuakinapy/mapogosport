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
@Table(name = "SportFieldDetails")
public class SportFieldDetail implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "SportFielDetailId", nullable = false, unique = true)
	private Integer sportFielDetailId;

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
	private int percentDeposit;

	@ManyToOne
	@JoinColumn(name = "SportFiledId", nullable = false)
	private SportField sportField;

	@Column(name = "PeakHour", nullable = false)
	private String peakHour;

	@OneToMany(mappedBy = "sportFieldDetail", cascade = CascadeType.ALL) // corrected from "sportsField"
	@JsonIgnore
	private List<BookingDetail> bookingDetails;
}
