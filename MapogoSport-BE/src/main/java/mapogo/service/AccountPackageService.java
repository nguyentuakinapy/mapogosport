package mapogo.service;

import java.util.List;

import mapogo.dto.AccountPackageDTO;
import mapogo.entity.AccountPackage;

public interface AccountPackageService {
	
	List<AccountPackage> findAll();
	AccountPackage updateAccountPackage(Integer id, AccountPackageDTO dto);
	
}
