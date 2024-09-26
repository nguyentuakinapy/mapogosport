package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.AddressUser;

public interface AddressUserDAO extends JpaRepository<AddressUser, Integer>{

}
