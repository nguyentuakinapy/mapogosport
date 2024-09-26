package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Owner;

public interface OwnerDAO extends JpaRepository<Owner, Integer>{

}
