package mapogo.dto;

import java.util.List;
import java.util.stream.Collectors;

import mapogo.entity.AccountPackage;
import mapogo.entity.AccountPackageBenefit;
import mapogo.entity.Benefit;

public class AccountPackageConverter {

    // Chuyển đổi AccountPackage thành AccountPackageDTO
    public AccountPackageDTO toDTO(AccountPackage accountPackage) {
        List<AccountPackageBenefitDTO> benefits = accountPackage.getAccountPackageBenefits().stream()
            .map(apb -> new AccountPackageBenefitDTO(
                apb.getAccountPackageBenefitId(),
                new BenefitDTO(
                    apb.getBenefit().getBenefitId(),
                    apb.getBenefit().getDescription()
                )
            ))
            .collect(Collectors.toList());

        return new AccountPackageDTO(
            accountPackage.getAccountPackageId(),
            accountPackage.getPackageName(),
            accountPackage.getPrice(),
            accountPackage.getDurationDays(),
            accountPackage.getLimitBookings(),
            accountPackage.getLimitSportFields(),
            benefits
        );
    }

    // Chuyển đổi AccountPackageDTO thành AccountPackage (cập nhật mô tả lợi ích)
    public AccountPackage toEntity(AccountPackageDTO accountPackageDTO, AccountPackage existingPackage) {
        existingPackage.setPackageName(accountPackageDTO.getPackageName());
        existingPackage.setPrice(accountPackageDTO.getPrice());
        existingPackage.setDurationDays(accountPackageDTO.getDurationDays());
        existingPackage.setLimitBookings(accountPackageDTO.getLimitBookings());
        existingPackage.setLimitSportFields(accountPackageDTO.getLimitSportFields());

        // Cập nhật danh sách AccountPackageBenefits
        List<AccountPackageBenefit> updatedBenefits = accountPackageDTO.getAccountPackageBenefits().stream()
            .map(accountPackageBenefitDTO -> {
                AccountPackageBenefit benefit = new AccountPackageBenefit();
                benefit.setAccountPackageBenefitId(accountPackageBenefitDTO.getAccountPackageBenefitId());
                
                // Cập nhật mô tả lợi ích
                Benefit benefitEntity = new Benefit();
                benefitEntity.setBenefitId(accountPackageBenefitDTO.getBenefit().getBenefitId());
                benefitEntity.setDescription(accountPackageBenefitDTO.getBenefit().getDescription()); // Cập nhật mô tả từ DTO
                benefit.setBenefit(benefitEntity);

                return benefit;
            })
            .collect(Collectors.toList());

        existingPackage.setAccountPackageBenefits(updatedBenefits);

        return existingPackage;
    }
}
