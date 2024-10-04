package mapogo.service;

import java.util.List;

import mapogo.entity.Authority;

public interface AuthorityService {

	Authority createAuthority(Authority auth);

	List<Authority> findAll();
	
}
