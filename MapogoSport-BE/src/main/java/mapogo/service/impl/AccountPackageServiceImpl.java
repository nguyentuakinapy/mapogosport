package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.AccountPackageDAO;
import mapogo.entity.AccountPackage;
import mapogo.service.AccountPackageService;
@Service
public class AccountPackageServiceImpl implements AccountPackageService{
	
	@Autowired
	AccountPackageDAO accountPackageDAO;

	@Override
	public List<AccountPackage> findAll() {
		return accountPackageDAO.findAll();
	}
	


}
