package mapogo.entity;

import java.io.Serializable;
import java.util.List;

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
public class AccountPackageBenefit implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountPackageBenefitId")
    private int accountPackageBenefitId;
    
    @ManyToOne
    @JoinColumn(name = "BenefitId")
    private Benefit benefit;
    
    @ManyToOne
    @JoinColumn(name = "AccountPackageId")
    private AccountPackage accountPackage;

}
