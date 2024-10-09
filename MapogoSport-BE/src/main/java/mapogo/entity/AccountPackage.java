package mapogo.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "Accountpackages")
public class AccountPackage implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountPackageId")
    private Integer accountPackageId;

    @Column(name = "PackageName", nullable = false)
    private String packageName;

    @Column(name = "Price", nullable = false)
    private double price;

    @Column(name = "DurationDays", nullable = false)
    private int durationDays;

    @OneToMany(mappedBy = "accountPackage", cascade = CascadeType.ALL)
    @JsonIgnore // Ngăn vòng lặp tuần tự hóa
    private List<AccountPackageBenefit> accountPackageBenefits;

    @OneToMany(mappedBy = "accountPackage", cascade = CascadeType.ALL)
    @JsonIgnore // Ngăn vòng lặp tuần tự hóa
    private List<UserSubscription> userSubscriptions;

}
