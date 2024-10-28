package mapogo.entity;

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
@Table(name = "Phonenumberuser")
public class PhoneNumberUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PhoneNumberUserId")
    private Integer phoneNumberUserId;
    
    @ManyToOne
    @JoinColumn(name = "PhoneNumberId")
    @JsonBackReference
    private PhoneNumber phoneNumber;
    
    @ManyToOne
	@JoinColumn(name = "Username")
	@JsonBackReference // Ngăn vòng lặp tuần tự hóa
	private User user;
    
    @Column(name= "Active")
    @JsonManagedReference
    private Boolean active;
}
