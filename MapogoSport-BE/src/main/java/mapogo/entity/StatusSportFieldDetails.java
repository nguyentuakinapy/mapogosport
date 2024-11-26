package mapogo.entity;

import java.time.LocalDateTime;

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
@Table(name = "Statussportfielddetails")
public class StatusSportFieldDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "StatusSportFieldDetailId")
	private Integer statusSportFieldId;
	
	@ManyToOne
	@JoinColumn(name = "sportFielDetailId", nullable = false)
	@JsonBackReference
	private SportFieldDetail sportFieldDetail;
	
	@Column(name="Startdate")
	private LocalDateTime startDate;
	
	
	@Column(name="Enddate", nullable = true)
	private LocalDateTime endDate;
	
	@Column(name="Statusname")
	private String statusName;
}
