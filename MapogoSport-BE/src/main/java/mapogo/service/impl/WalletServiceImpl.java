package mapogo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.TransactionDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.WalletDAO;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.Wallet;
import mapogo.service.WalletService;
@Service
public class WalletServiceImpl implements WalletService {
	@Autowired
	WalletDAO walletDAO;
	
	@Autowired
	UserDAO userDAO;
	
	@Autowired
	TransactionDAO transactionDAO;

	@Override
	public Wallet findByUsername(User user) {
		return walletDAO.findByUser(user);
	}

	@Override
	public Wallet update(Wallet wallet) {
		return walletDAO.save(wallet);
	}
	
	@Override
	public Wallet create(String username) {
		Wallet w = new Wallet();
		User u = userDAO.findById(username).get();
		w.setUser(u);
		w.setBalance(BigDecimal.valueOf(0));		
		return walletDAO.save(w);
	}

	@Override
	public Wallet updateWalletAndCreateTransaction(String username, Double price) {
		User u = userDAO.findById(username).get();
		Wallet w = u.getWallet();
		
		w.setBalance(w.getBalance().subtract(BigDecimal.valueOf(price)));
		
		Transaction transaction = new Transaction();
		transaction.setAmount(BigDecimal.valueOf(price));
		transaction.setCreatedAt(LocalDateTime.now());
		transaction.setDescription("Thanh toán gói đăng ký trở thành chủ sân!");
		transaction.setTransactionType("-" + price);
		transaction.setWallet(w);
		transactionDAO.save(transaction);
		walletDAO.save(w);
		return w;
	}
	
}
