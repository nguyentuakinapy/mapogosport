package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Owner;
import mapogo.entity.User;

public interface OwnerDAO extends JpaRepository<Owner, Integer>{
	Owner findByUser(User username);
}
