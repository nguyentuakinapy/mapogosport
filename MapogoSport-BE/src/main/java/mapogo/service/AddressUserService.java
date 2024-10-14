package mapogo.service;

import java.util.List;

import mapogo.entity.AddressUser;

public interface AddressUserService {
	List<AddressUser> findByUsername(String username);
	void deleteAddressByUser(Integer addressUserId);
	List<AddressUser> addAddressByUsername(String username, List<AddressUser> newAddress);
	AddressUser updateAddressUser(Integer addressUserId, AddressUser updateAddress);
}
