package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import mapogo.entity.Notification;

public interface NotificationDAO extends JpaRepository<Notification, Integer> {

	@Modifying
	@Transactional
	@Query("DELETE FROM Notification n WHERE n.user.username = :username")
	void deleteByUsername(@Param("username") String username);

}
