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
@Table(name = "AccountPackages")
public class AccountPackage implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountPackageId")
    private int accountPackageId;
    
    @Column(name = "PackageName", nullable = false)
    private String packageName;
    
    @Column(name = "Price", nullable = false)
    private double price;
    
    @Column(name = "DurationDays", nullable = false)
    private int durationDays;
    
    @Column(name = "Features", nullable = false)
    private String features;

    @OneToMany(mappedBy = "accountPackage", cascade = CascadeType.ALL)
    private List<UserSubscription> userSubscriptions;

}