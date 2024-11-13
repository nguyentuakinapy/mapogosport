package mapogo.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import mapogo.dao.AccountPackageBenefitDAO;
import mapogo.dao.AccountPackageDAO;
import mapogo.dao.BenefitDAO;
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
	@Autowired
	BenefitDAO benefitDao;

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

	@Override
	public AccountPackage createAccountPackage(AccountPackageDTO accountPackageDTO) {
		// Bước 1: Tạo entity AccountPackage từ DTO
		AccountPackage accountPackage = new AccountPackage();
		accountPackage.setPackageName(accountPackageDTO.getPackageName());
		accountPackage.setPrice(accountPackageDTO.getPrice());
		accountPackage.setDurationDays(accountPackageDTO.getDurationDays());
		accountPackage.setLimitBookings(accountPackageDTO.getLimitBookings());
		accountPackage.setLimitSportFields(accountPackageDTO.getLimitSportFields());

		// Bước 2: Lưu AccountPackage vào cơ sở dữ liệu
		AccountPackage savedAccountPackage = accountPackageDAO.save(accountPackage);

		// Bước 3: Lấy và kết nối các benefits với AccountPackage
		List<AccountPackageBenefit> accountPackageBenefits = accountPackageDTO.getAccountPackageBenefits().stream()
				.map(accountPackageBenefitDTO -> {
					// Bước 4: Lấy Benefit từ repository theo BenefitId trong DTO
					Benefit benefit = benefitDao.findById(accountPackageBenefitDTO.getBenefit().getBenefitId())
							.orElseThrow(() -> new RuntimeException("Benefit không tồn tại"));

					// Bước 5: Tạo AccountPackageBenefit và kết nối với AccountPackage
					AccountPackageBenefit accountPackageBenefit = new AccountPackageBenefit();
					accountPackageBenefit.setBenefit(benefit);
					accountPackageBenefit.setAccountPackage(savedAccountPackage);

					return accountPackageBenefit;
				}).collect(Collectors.toList());

		// Bước 6: Gán danh sách AccountPackageBenefit vào AccountPackage
		savedAccountPackage.setAccountPackageBenefits(accountPackageBenefits);

		// Bước 7: Lưu AccountPackage đã cập nhật (bao gồm benefits)
		accountPackageDAO.save(savedAccountPackage);

		return savedAccountPackage;
	}

	@Override
	public void deleteAccountPackage(Integer accountPackageId) {
		 // Deleting the AccountPackage by its ID
        Optional<AccountPackage> packageOptional = accountPackageDAO.findById(accountPackageId);
        if (packageOptional.isPresent()) {
        	accountPackageDAO.deleteById(accountPackageId);
        } else {
            throw new EntityNotFoundException("AccountPackage not found with id: " + accountPackageId);
        }
		
	}
	
	
}
