package mapogo.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "Favoritefields")
public class FavoriteField implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FavoriteFieldId")
    private Integer favoriteFieldId;

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    @JsonIgnore //phihung đã ở đây, có thể mở ra khi cần, hiện tại đóng để giảm dữ liệu từ get
    private User user;

    @ManyToOne
    @JoinColumn(name = "SportFieldId", nullable = false)
    private SportField sportField;

    @Column(name = "AddedDate", nullable = false)
    private LocalDateTime addedDate;
}

