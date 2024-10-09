package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Sportfields")
public class SportField implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SportFieldId", nullable = false, unique = true)
    private Integer sportFieldId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Address", nullable = false)
    private String address;

    @Column(name = "Opening", nullable = false)
    private String opening;

    @Column(name = "Closing", nullable = false)
    private String closing;
    
    @ManyToOne
    @JoinColumn(name = "CategoriesFieldId", nullable = false)
    private CategoryField categoriesField;

    @Column(name = "Quantity", nullable = false)
    private int quantity;
    
    @Column(name = "Status", nullable = false)
    private String status;

    @Column(name = "Image", nullable = false)
    private String image;

    @ManyToOne
    @JoinColumn(name = "OwnerId", nullable = false)
    @JsonIgnore
    private Owner owner;

    @Column(name = "Decription", nullable = false)
    private String decription;

    @OneToMany(mappedBy = "sportField", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<SportFieldDetail> sportFielDetails;

    @OneToMany(mappedBy = "sportField", cascade = CascadeType.ALL) // corrected from "sportsField"
    @JsonIgnore
    private List<FavoriteField> favoriteFields;
 
    @OneToMany(mappedBy = "sportField", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FieldReview> fieldReviews;
}

