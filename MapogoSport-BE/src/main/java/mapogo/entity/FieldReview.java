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
@Table(name = "Fieldreviews")
public class FieldReview implements Serializable{
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FieldReviewId")
    private Integer fieldReviewId;

    @ManyToOne
    @JoinColumn(name = "SportFieldId", nullable = false)
    private SportField sportField;

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    private User user;

    @Column(name = "Rating", nullable = false)
    private Integer rating;

    @Column(name = "Comment")
    private String comment;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "DatedAt", nullable = false)
    private Date datedAt = new Date();
}

