package mapogo.entity;

import java.io.Serializable;

import jakarta.persistence.*;
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
@Table(name = "AddressUser")
public class AddressUser implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AddressUserId")
    private int addressUserId;

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "Address", nullable = false)
    private Address address;

    @Column(name = "PhoneNumber")
    private String phoneNumber;

    @Column(name = "AddressDetail", nullable = false)
    private String addressDetail;

}

