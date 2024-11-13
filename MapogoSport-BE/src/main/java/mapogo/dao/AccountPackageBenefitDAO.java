package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.AccountPackageBenefit;

public interface AccountPackageBenefitDAO extends JpaRepository<AccountPackageBenefit, Integer> {
	List<AccountPackageBenefit> findByAccountPackage_AccountPackageId(Integer accountPackageId);
}
