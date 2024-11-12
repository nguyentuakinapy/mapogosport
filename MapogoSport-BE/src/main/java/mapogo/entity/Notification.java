package mapogo.entity;

import java.time.LocalDateTime;
import java.util.List;

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

@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Notification")
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "NotificationId")
	private Long notificationId;

	@ManyToOne
	@JoinColumn(name = "Username", nullable = false)
	private User user;

	@Column(name = "Title", nullable = false, length = 255)
	private String title;

	@Column(name = "Message", columnDefinition = "TEXT")
	private String message;

	@Column(name = "Type", length = 50)
	private String type;

	@Column(name = "Is_Read")
	private Boolean isRead = false;

	@Column(name = "Created_At", nullable = false, updatable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@Column(name = "Updated_At")
	private LocalDateTime updatedAt = LocalDateTime.now();
	
	
}