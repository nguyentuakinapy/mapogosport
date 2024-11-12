package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BenefitDAO;
import mapogo.entity.Benefit;
import mapogo.service.BenefitService;

@Service
public class BenefitServiceImpl implements BenefitService {
	@Autowired
	BenefitDAO benefitDao;

	@Override
	public List<Benefit> findAll() {

		return benefitDao.findAll();
	}

}
