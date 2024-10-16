package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.FavoriteFieldDAO;
import mapogo.entity.FavoriteField;
import mapogo.service.FavoriteFieldService;

@Service
public class FavoriteFieldServiceImpl implements FavoriteFieldService{
	@Autowired
	FavoriteFieldDAO favoriteFieldDAO;

	@Override
	public List<FavoriteField> findByUser_Username(String username) {
		return favoriteFieldDAO.findByUser_Username(username);
	}

}
