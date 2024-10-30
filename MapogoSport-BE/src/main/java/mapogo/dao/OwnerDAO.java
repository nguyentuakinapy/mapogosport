package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.Owner;
import mapogo.entity.User;

public interface OwnerDAO extends JpaRepository<Owner, Integer> {
	Owner findByUser(User username);

	@Query("SELECT o FROM Owner o WHERE o.user.username = ?1")
	Owner findByUsername(String username);
}
