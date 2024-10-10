package mapogo.service;

import java.util.List;

import mapogo.entity.SportField;

public interface SportFieldService {
	List<SportField> findAll();
	
	SportField findBySportFieldId(Integer Id);
	
	List<SportField> findSportFeildByOwner(Integer id);
}
