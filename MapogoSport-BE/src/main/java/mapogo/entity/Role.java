package mapogo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Roles")
public class Role implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "RoleId", nullable = false)
	private Integer roleId;

	@Column(name = "Name", nullable = false)
	private String name;

	@OneToMany(mappedBy = "role")
    @JsonIgnore
	private List<Authority> authorities;

}
