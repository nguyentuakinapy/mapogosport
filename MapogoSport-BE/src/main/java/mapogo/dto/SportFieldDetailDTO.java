package mapogo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SportFieldDetailDTO {
	private int sportFieldDetailId;
	private String name;

	private double price;

	private double peakHourPrices;

	private String size;

	private String status;

	private int percentDeposit;

	private String peakHour;
	private int sportFieldId;
}
