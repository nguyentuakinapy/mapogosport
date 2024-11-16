package mapogo.service;

import java.util.List;

import mapogo.dto.AccountPackageDTO;
import mapogo.entity.AccountPackage;

public interface AccountPackageService {

	List<AccountPackage> findAll();

	AccountPackage updateAccountPackage(Integer id, AccountPackageDTO dto);

	// của Mỵ từ đây
	AccountPackage findById(Integer id);
	// đến đây

	AccountPackage createAccountPackage(AccountPackageDTO accountPackageDTO);

	void deleteAccountPackage(Integer accountPackageId);
}
