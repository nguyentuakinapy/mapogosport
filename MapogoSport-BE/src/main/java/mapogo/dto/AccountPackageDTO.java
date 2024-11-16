package mapogo.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountPackageDTO implements Serializable {
     Integer accountPackageId;
     String packageName;
     double price;
     Integer durationDays;
     Integer limitBookings;
     Integer limitSportFields;
     String status;
     List<AccountPackageBenefitDTO> accountPackageBenefits; // Danh sách các lợi ích (là DTO)
}
