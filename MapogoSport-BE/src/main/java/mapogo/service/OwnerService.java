package mapogo.service;

import java.util.Map;

import mapogo.entity.Owner;
import mapogo.entity.User;

public interface OwnerService {
	Owner findOwnerByUsername(User useranme);

	
	Owner findByUsername(String useranme);
	
	Owner save(Map<String, Object> owner);
}
