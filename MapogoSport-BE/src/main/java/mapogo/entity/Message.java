package mapogo.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "messageid")
    private Integer messageId;

    @ManyToOne
    @JoinColumn(name = "senderusername", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiverusername", nullable = false)
    private User receiver;

    @Column(name = "Content", nullable = false)
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdat", nullable = false)
    private Date createdAt = new Date();

    @Column(name = "isdeleted", nullable = false)
    private Boolean isDeleted = false;
}
