package mapogo.service;

import java.math.BigDecimal;

import mapogo.entity.User;
import mapogo.entity.Wallet;

public interface WalletService {
	// của Mỵ từ đây
	Wallet findByUsername(User user);

	Wallet update(Wallet wallet);
	
	Wallet addFundsToAdminWallet(BigDecimal amount, String description);
	// đến đây

	Wallet create(String username);

	Wallet updateWalletAndCreateTransaction(String username, Double price);

	void addMoney(String username, Double money);
}
