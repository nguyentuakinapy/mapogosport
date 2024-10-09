package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.AddressUser;

public interface AddressUserDAO extends JpaRepository<AddressUser, Integer>{
	List<AddressUser> findByUser_Username(String username);
}
