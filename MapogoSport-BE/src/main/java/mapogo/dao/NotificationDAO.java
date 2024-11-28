package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import mapogo.entity.Notification;
import mapogo.entity.Order;

public interface NotificationDAO extends JpaRepository<Notification, Integer> {

	@Modifying
	@Transactional
	@Query("DELETE FROM Notification n WHERE n.user.username = :username")
	void deleteByUsername(@Param("username") String username);
	
	Notification findByOrder(Order order);

    List<Notification> findByUser_UsernameContainingAndTypeContaining(String username, String type);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.user.username = :username AND n.type = :type")
    void deleteByUsernameAndType(@Param("username") String username, @Param("type") String type);

}
