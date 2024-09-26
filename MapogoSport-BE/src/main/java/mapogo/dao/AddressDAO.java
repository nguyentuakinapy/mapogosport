package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Address;

public interface AddressDAO extends JpaRepository<Address, Integer>{

}
