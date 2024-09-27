package mapogo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@Table(name = "UserSubscriptions")
public class UserSubscription implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserSubscription", nullable = false, unique = true)
    private int userSubscriptionId;

    @ManyToOne
    @JoinColumn(name = "AccountPackageId", nullable = false)
    private AccountPackage accountPackage;

    @ManyToOne
    @JoinColumn(name = "User", nullable = false)
    private User user;

    @Temporal(TemporalType.DATE)
    @Column(name = "StartDay", nullable = false)
    private Date startDay;

    @Temporal(TemporalType.DATE)
    @Column(name = "EndDay", nullable = false)
    private Date endDay;

    @Column(name = "Status", nullable = false)
    private String status;
    
	@OneToMany(mappedBy = "userSubscription", cascade = CascadeType.ALL)
    private List<SubscriptionPayment> subscriptionPayments;

}
