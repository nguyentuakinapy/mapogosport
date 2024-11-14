package mapogo.service;

import java.util.List;

import mapogo.entity.Benefit;

public interface BenefitService {
	List<Benefit> findAll();
	
	Benefit addBeneFit(Benefit beneFit);
}
