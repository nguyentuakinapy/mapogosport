package mapogo.service;

import mapogo.entity.User;
import mapogo.entity.Wallet;

public interface WalletService {
	//của Mỵ từ đây
	Wallet findByUsername(User user);
	Wallet update(Wallet wallet);
	//đến đây
}
