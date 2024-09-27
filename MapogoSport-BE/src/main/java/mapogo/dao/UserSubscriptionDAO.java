package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.UserSubscription;

public interface UserSubscriptionDAO extends JpaRepository<UserSubscription, Integer>{

}
