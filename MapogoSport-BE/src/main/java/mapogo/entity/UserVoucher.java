package mapogo.entity;

import java.io.Serializable;
import java.util.Date;

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
@Table(name = "UserVoucher")
public class UserVoucher implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserVoucherId")
    private int userVoucherId;
    
    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "VoucherId", nullable = false)
    private Voucher voucher;

    @Column(name = "Status", nullable = false)
    private String status;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "Date", nullable = false)
    private Date Date;


}