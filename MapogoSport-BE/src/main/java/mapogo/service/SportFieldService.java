package mapogo.service;

import java.util.List;

import mapogo.dto.SportFieldDTO;
import mapogo.entity.SportField;

public interface SportFieldService {
	List<SportField> findAll();
	
	SportField findBySportFieldId(Integer Id);
	
	//Mỵ sửa lỗi chính tả
	List<SportField> findSportFieldByOwner(Integer id);// hht lấy
	
	//Của Mỵ 
	SportField create(SportFieldDTO sportFieldDTO);
	//
}
