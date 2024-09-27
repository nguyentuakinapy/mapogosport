package mapogo.entity;

import java.io.Serializable;
import java.util.List;

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
@Table(name = "Address")
public class Address implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AddressId")
    private int addressId;

    @Column(name = "Province", nullable = false)
    private String province;

    @Column(name = "District", nullable = false)
    private String district;

    @Column(name = "Ward", nullable = false)
    private String ward;

    @OneToMany(mappedBy = "address", cascade = CascadeType.ALL)
    private List<AddressUser> addressUsers;
}

