package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SportsField")
public class SportField implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SportsFieldId", nullable = false, unique = true)
    private int sportsFieldId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Address", nullable = false)
    private String address;

    @Column(name = "Opening", nullable = false)
    private String opening;

    @ManyToOne
    @JoinColumn(name = "CategoryField", nullable = false)
    private CategoryField categoriesField;

    @Column(name = "Status", nullable = false)
    private boolean status;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Column(name = "Image", nullable = false)
    private String image;

    @ManyToOne
    @JoinColumn(name = "OwnerId", nullable = false)
    private Owner owner;

    @Column(name = "Decription", nullable = false)
    private String decription;

    @OneToMany(mappedBy = "sportsField", cascade = CascadeType.ALL)
    private List<SportFielDetail> sportFielDetails;

    @OneToMany(mappedBy = "sportsField", cascade = CascadeType.ALL)
    private List<FavoriteField> favoriteFields;

    @OneToMany(mappedBy = "sportsField", cascade = CascadeType.ALL)
    private List<SportField> sportsFields;
    
    @OneToMany(mappedBy = "sportsField", cascade = CascadeType.ALL)
    private List<FieldReview> fieldReviews;
}
