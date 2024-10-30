package mapogo.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FieldReviewDTO {
	private Integer sportFieldId;
	private String username;
	private Integer rating;
	private String comment;
	private Date datedAt = new Date();
}
