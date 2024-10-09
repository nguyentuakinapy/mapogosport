package mapogo.service;

import java.util.List;

import mapogo.entity.AddressUser;

public interface AddressUserService {
	List<AddressUser> findByUsername(String username);
}
