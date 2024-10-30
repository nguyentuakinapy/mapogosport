package mapogo.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "Productreviews")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "productReviewId")

public class ProductReview implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductReviewId")
    private Integer productReviewId;

    @ManyToOne
    @JoinColumn(name = "ProductId", nullable = false)
    //@JsonBackReference //tanthanh
    @JsonManagedReference //phihung (27/10)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    // a
    private User user;

    @Column(name = "Rating", nullable = false)
    private Integer rating;

    @Column(name = "Comment")
    private String comment;

    @Column(name = "DatedAt", nullable = false)
    private LocalDateTime datedAt;

}

