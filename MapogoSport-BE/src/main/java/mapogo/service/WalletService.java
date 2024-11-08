package mapogo.service;

import mapogo.entity.User;
import mapogo.entity.Wallet;

public interface WalletService {
	Wallet findByUsername(User user);
}
