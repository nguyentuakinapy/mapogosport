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
@Table(name = "BlogImages")
public class BlogImage implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BlogImageId")
    private Integer blogImageId;

    @ManyToOne
    @JoinColumn(name = "BlogPostId", nullable = false)
    private BlogPost blogPost;

    @Column(name = "Image", nullable = false)
    private String image;

    @Column(name = "Description")
    private String description;

    @Temporal(TemporalType.DATE)
    @Column(name = "CreatedAt", nullable = false)
    private Date createdAt = new Date();
}

