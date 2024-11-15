package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Role;

public interface RoleDAO extends JpaRepository<Role, Integer>{
	//của Mỵ từ đây
	Role findByName(String roleName);
}
