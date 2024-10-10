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

	@Temporal(TemporalType.DATE)
	@Column(name = "Date", nullable = false)
	private Date date = new Date();

	@ManyToOne
	@JoinColumn(name = "Username", nullable = false)
	private User user;

	@Column(name = "ReferenceCode")
	private String referenceCode;

}
