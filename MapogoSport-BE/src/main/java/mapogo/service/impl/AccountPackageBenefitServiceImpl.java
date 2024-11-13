package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import mapogo.dao.AccountPackageBenefitDAO;
import mapogo.entity.AccountPackageBenefit;
import mapogo.service.AccountPackageBenefitService;

@Service
public class AccountPackageBenefitServiceImpl implements AccountPackageBenefitService {

	@Autowired
	AccountPackageBenefitDAO accountPackageBenefitDAO;

	@Override
	public List<AccountPackageBenefit> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteAccountPackageBenefit(Integer id) {
		// Delete a specific benefit by its ID
		List<AccountPackageBenefit> accbenefit = accountPackageBenefitDAO.findByAccountPackage_AccountPackageId(id);
		 // Delete each benefit
        for (AccountPackageBenefit benefit : accbenefit) {
        	accountPackageBenefitDAO.deleteById(benefit.getAccountPackageBenefitId());
        }
	}

}
