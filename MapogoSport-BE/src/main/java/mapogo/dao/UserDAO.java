package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.User;

public interface UserDAO extends JpaRepository<User, String> {

}
