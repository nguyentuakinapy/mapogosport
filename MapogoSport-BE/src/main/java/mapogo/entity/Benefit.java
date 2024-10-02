package mapogo.entity;

import java.io.Serializable;

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
public class Benefit implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BenefitId")
    private int benefitId;

    @ManyToOne
    @JoinColumn(name = "AccountPackageId", nullable = false)
    private AccountPackage accountPackage;

    @Column(name = "Description", nullable = false)
    private String description;
    

}
