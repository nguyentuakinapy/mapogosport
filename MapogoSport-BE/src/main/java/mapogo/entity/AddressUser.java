package mapogo.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
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
@Table(name = "Addressuser")
public class AddressUser implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "AddressUserId")
	private Integer addressUserId;

	@ManyToOne
	@JoinColumn(name = "Username")
	@JsonBackReference // Ngăn vòng lặp tuần tự hóa
	private User user;

	@ManyToOne
	@JoinColumn(name = "AddressId", nullable = false)
	private Address address;

	@Column(name = "PhoneNumber")
	private String phoneNumber;

	@Column(name = "AddressDetail", nullable = false)
	private String addressDetail;

}
