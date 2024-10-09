package mapogo.entity;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
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
@Table(name = "Favoritefields")
public class FavoriteField implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FavoriteFieldId")
    private Integer favoriteFieldId;

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "SportFieldId", nullable = false)
    private SportField sportField;

    @Temporal(TemporalType.DATE)
    @Column(name = "AddedDate", nullable = false)
    private Date addedDate = new Date();
}

