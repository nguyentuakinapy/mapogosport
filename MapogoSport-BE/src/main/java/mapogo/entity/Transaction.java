package mapogo.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "Transactions")
public class Transaction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "TransactionId")
	Integer transactionId;
	
	@ManyToOne
	@JoinColumn(name = "WalletId")
	@JsonIgnore
	Wallet wallet;
	
	@Column(name="Amount")
	BigDecimal amount;
	
	@Column(name="TransactionType")
	String transactionType;
	
	@Column(name="Description")
	String description;
	
	@Column(name="CreatedAt")
	LocalDateTime createdAt;
}
