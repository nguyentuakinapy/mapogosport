package mapogo.service;

import java.util.List;

import mapogo.entity.AccountPackageBenefit;


public interface AccountPackageBenefitService {
	List<AccountPackageBenefit> findAll();

	void deleteAccountPackageBenefit( Integer id);

//	List<AccountPackageBenefit> findByAccountPackage_AccountPackageId(Integer accountPackageId);
}
