package mapogo.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

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
@Table(name = "Uservoucher")
public class UserVoucher implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserVoucherId")
    private Integer userVoucherId;
    
    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "VoucherId", nullable = false)
    @JsonManagedReference  //Mỵ đổi ngày 9-11
    private Voucher voucher;

    @Column(name = "Status", nullable = false)
    private String status;
    
    @Column(name = "Date", nullable = false)
    private LocalDateTime date;


}
