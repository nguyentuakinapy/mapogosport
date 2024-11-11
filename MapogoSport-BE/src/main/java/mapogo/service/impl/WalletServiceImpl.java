package mapogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.WalletDAO;
import mapogo.entity.User;
import mapogo.entity.Wallet;
import mapogo.service.WalletService;
@Service
public class WalletServiceImpl implements WalletService {
	@Autowired
	WalletDAO walletDAO;

	@Override
	public Wallet findByUsername(User user) {
		return walletDAO.findByUser(user);
	}

	@Override
	public Wallet update(Wallet wallet) {
		return walletDAO.save(wallet);
	}
}
