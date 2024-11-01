package mapogo.service;

import mapogo.entity.Owner;
import mapogo.entity.User;

public interface OwnerService {
	Owner findOwnerByUsername(User useranme);
	//Mỵ
	Owner findByUsername(String username);
}
