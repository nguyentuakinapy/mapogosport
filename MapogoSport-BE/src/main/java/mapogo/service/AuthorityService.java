package mapogo.service;

import java.util.List;

import mapogo.entity.Authority;
import mapogo.entity.User;

public interface AuthorityService {

	Authority createAuthority(Authority auth);

	List<Authority> findAll();

	//của Mỵ từ đây
	void deleteByUser(User user);
	//đến đây
}
