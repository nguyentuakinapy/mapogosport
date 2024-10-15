package mapogo.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "Blogposts")
public class BlogPost implements Serializable{

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BlogPostId")
    private Integer blogPostId;

    @ManyToOne
    @JoinColumn(name = "OwnerId", nullable = false)
    private Owner owner;

    @Column(name = "Title", nullable = false)
    private String title;

    @Column(name = "Content", nullable = false)
    private String content;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UpdateAt")
    private LocalDateTime updateAt;

    @Column(name = "Status", nullable = false)
    private String status;

    @Column(name = "Views", nullable = false)
    private Integer views;
    
    @OneToMany(mappedBy = "blogPost")
    private List<BlogImage> blogImages;

}

