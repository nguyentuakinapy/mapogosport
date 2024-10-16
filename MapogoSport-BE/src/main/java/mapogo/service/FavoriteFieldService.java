package mapogo.service;

import java.util.List;

import mapogo.entity.FavoriteField;

public interface FavoriteFieldService {
	List<FavoriteField> findByUser_Username(String username);
}
