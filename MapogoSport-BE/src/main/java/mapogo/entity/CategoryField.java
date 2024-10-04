package mapogo.entity;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
@Table(name = "CategoriesField")
public class CategoryField implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoriesFieldId")
    private Integer categoriesFieldId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Image", nullable = false)
    private String image;

    @OneToMany(mappedBy = "categoriesField", cascade = CascadeType.ALL)
    private List<SportField> sportField;

}