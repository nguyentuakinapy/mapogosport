package mapogo.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.AccountPackageBenefitDAO;
import mapogo.dao.AccountPackageDAO;
import mapogo.dto.AccountPackageDTO;
import mapogo.entity.AccountPackage;
import mapogo.entity.AccountPackageBenefit;
import mapogo.entity.Benefit;
import mapogo.service.AccountPackageService;

@Service
public class AccountPackageServiceImpl implements AccountPackageService {

	@Autowired
	AccountPackageDAO accountPackageDAO;
	@Autowired
	AccountPackageBenefitDAO accountPackageBenefitDAO;

	@Override
	public List<AccountPackage> findAll() {
		return accountPackageDAO.findAll();
	}

	public AccountPackage updateAccountPackage(Integer id, AccountPackageDTO accountPackageDTO) {
		// Tìm gói đăng ký theo ID
		AccountPackage accountPackage = accountPackageDAO.findById(id)
				.orElseThrow(() -> new RuntimeException("Gói không tồn tại"));

		// Cập nhật các trường trong entity từ DTO
		accountPackage.setPackageName(accountPackageDTO.getPackageName());
		accountPackage.setPrice(accountPackageDTO.getPrice());
		accountPackage.setDurationDays(accountPackageDTO.getDurationDays());
		accountPackage.setLimitBookings(accountPackageDTO.getLimitBookings());
		accountPackage.setLimitSportFields(accountPackageDTO.getLimitSportFields());

		// Cập nhật danh sách lợi ích
		List<AccountPackageBenefit> updatedBenefits = accountPackageDTO.getAccountPackageBenefits().stream()
				.map(accountPackageBenefitDTO -> {
					// Tìm kiếm lợi ích đã có hoặc tạo mới nếu không tồn tại
					AccountPackageBenefit accountPackageBenefit = accountPackageBenefitDAO
							.findById(accountPackageBenefitDTO.getAccountPackageBenefitId())
							.orElse(new AccountPackageBenefit()); // Nếu không tìm thấy, tạo mới

					// Cập nhật lợi ích
					accountPackageBenefit
							.setAccountPackageBenefitId(accountPackageBenefitDTO.getAccountPackageBenefitId());

					Benefit benefit = accountPackageBenefit.getBenefit();
					if (benefit == null) {
						benefit = new Benefit();
						accountPackageBenefit.setBenefit(benefit);
					}

					// Cập nhật mô tả của lợi ích
					benefit.setBenefitId(accountPackageBenefitDTO.getBenefit().getBenefitId());
					benefit.setDescription(accountPackageBenefitDTO.getBenefit().getDescription());

					// Trả về accountPackageBenefit đã cập nhật
					return accountPackageBenefit;
				}).collect(Collectors.toList());

		// Cập nhật lại danh sách lợi ích của gói đăng ký
		accountPackage.setAccountPackageBenefits(updatedBenefits);

		// Lưu lại gói đã cập nhật
		return accountPackageDAO.save(accountPackage);
	}

}
