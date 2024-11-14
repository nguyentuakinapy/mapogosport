package mapogo.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Benefits")
public class Benefit implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "BenefitId")
	private Integer benefitId;

	@Column(name = "Description", nullable = false)
	private String description;

	@OneToMany(mappedBy = "benefit", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<AccountPackageBenefit> accountPackageBenefits;
}
