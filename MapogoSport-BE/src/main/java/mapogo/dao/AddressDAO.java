package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.Address;

public interface AddressDAO extends JpaRepository<Address, Integer>{
	@Query("SELECT a FROM Address a WHERE a.ward = ?1 AND a.district = ?2 AND a.province = ?3")
	Address findExistedAddress(String ward, String district, String province);
	
}
