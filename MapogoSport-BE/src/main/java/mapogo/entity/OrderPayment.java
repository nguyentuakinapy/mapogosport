package mapogo.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

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
@Table(name = "Orderpayments")
public class OrderPayment implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "OrderPaymentId")
	private Integer orderPaymentId;

	@ManyToOne
	@JoinColumn(name = "OrderId", nullable = false)
	private Order order;

	@Column(name = "Amount", nullable = false)
	private Double amount;

	@Column(name = "Status", nullable = false)
	private String status;

	@Column(name = "Date", nullable = false)
	private LocalDateTime date;

	@ManyToOne
	@JoinColumn(name = "Username", nullable = false)
	private User user;

	@Column(name = "ReferenceCode")
	private String referenceCode;

}
