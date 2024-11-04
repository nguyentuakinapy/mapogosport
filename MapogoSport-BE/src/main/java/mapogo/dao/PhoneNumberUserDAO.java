package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.PhoneNumberUser;

public interface PhoneNumberUserDAO extends JpaRepository<PhoneNumberUser, Integer>{
	List<PhoneNumberUser> findByUser_Username(String username);
	void deleteByPhoneNumberUserId(Integer phoneNumberUserId);
}
