package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Notification;

public interface NotificationDAO extends JpaRepository<Notification, Integer>{

}
