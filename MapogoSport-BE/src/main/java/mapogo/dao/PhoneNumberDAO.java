package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.PhoneNumber;

public interface PhoneNumberDAO extends JpaRepository<PhoneNumber, Integer>{

}
