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
@Table(name = "Authorities")
public class Authority implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "AuthorityId")
	private long authorityId;

	@ManyToOne
	@JoinColumn(name = "Username")
	@JsonBackReference // Ngăn vòng lặp tuần tự hóa
	private User user;

	@ManyToOne
	@JoinColumn(name = "Authority")
	private Role role;

}
