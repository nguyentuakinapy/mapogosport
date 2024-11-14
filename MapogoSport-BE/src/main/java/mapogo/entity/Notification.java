package mapogo.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.Transient;
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
	private Integer notificationId;

	@ManyToOne
	@JoinColumn(name = "Username", nullable = false)
	@JsonBackReference
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

	@ManyToOne
	@JoinColumn(name = "Booking_Id", nullable = true)
	@JsonBackReference
	private Booking booking = null;

	@ManyToOne
	@JoinColumn(name = "Order_Id", nullable = true)
	@JsonBackReference
	private Order order = null;

	@Transient
	private Integer bookingId;
	
	@Transient
	private Integer orderId;
	
	@Transient
	private String username;
}