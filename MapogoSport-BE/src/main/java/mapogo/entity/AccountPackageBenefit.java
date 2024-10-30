package mapogo.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "Accountpackagebenefit")
public class AccountPackageBenefit implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountPackageBenefitId")
    private Integer accountPackageBenefitId;

    @ManyToOne
    @JoinColumn(name = "BenefitId", nullable = false)
    @JsonManagedReference
    private Benefit benefit;

    @ManyToOne
    @JoinColumn(name = "AccountPackageId", nullable = false)
    @JsonBackReference
    private AccountPackage accountPackage;
}
