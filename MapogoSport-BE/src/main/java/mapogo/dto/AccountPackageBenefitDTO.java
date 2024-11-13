package mapogo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountPackageBenefitDTO {
     Integer accountPackageBenefitId;
     AccountPackageDTO accontPackage;
     BenefitDTO benefit; // Lợi ích đi kèm trong gói
}
