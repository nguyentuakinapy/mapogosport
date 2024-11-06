package mapogo.service;

import java.util.List;

import mapogo.entity.PhoneNumberUser;

public interface PhoneNumberUserService {
	void deletePhoneNumberByUser(Integer phoneNumberUserId);
	List<PhoneNumberUser> addPhoneNumberByUsername(String username, List<PhoneNumberUser> newPhoneNumber);
	PhoneNumberUser updatePhoneNumberUser(Integer phoneNumberUserId, PhoneNumberUser updatePhoneNumber);
}
