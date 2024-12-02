package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.UserSubscription;

public interface UserSubscriptionDAO extends JpaRepository<UserSubscription, Integer> {

	@Query("SELECT o FROM UserSubscription o WHERE o.user.username = ?1")
	UserSubscription findByUsername(String username);
	
	@Query("SELECT o FROM UserSubscription o WHERE o.accountPackage.accountPackageId = ?1")
	List<UserSubscription>  findByAccPgkId(int id);
	
	
}
