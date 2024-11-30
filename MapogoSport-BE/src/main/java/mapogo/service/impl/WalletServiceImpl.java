package mapogo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import mapogo.dao.TransactionDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.WalletDAO;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.Wallet;
import mapogo.service.TransactionService;
import mapogo.service.WalletService;
@Service
public class WalletServiceImpl implements WalletService {
	@Autowired
	WalletDAO walletDAO;
	
	@Autowired
	UserDAO userDAO;
	
	@Autowired
	TransactionDAO transactionDAO;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
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
		
		//Mỵ
		this.addFundsToAdminWallet(BigDecimal.valueOf(price), 
				username +" đăng ký trở thành chủ sân");
		return w;
	}

	@Override
	public void addMoney(String username, Double money) {
		User u = userDAO.findById(username).get();
		Wallet w = u.getWallet();
		w.setBalance(w.getBalance().add(BigDecimal.valueOf(money)));
		
		Transaction transaction = new Transaction();
		transaction.setAmount(BigDecimal.valueOf(money));
		transaction.setCreatedAt(LocalDateTime.now());
		transaction.setDescription("Bạn vừa nạp tiền vào ví tài khoản!");
		transaction.setTransactionType("+" + money);
		transaction.setWallet(w);
		transactionDAO.save(transaction);
		
		messagingTemplate.convertAndSend("/topic/wallet/username", u.getUsername());
		
	}
	
	@Autowired
	TransactionService transactionService;

	@Override
	public Wallet addFundsToAdminWallet(BigDecimal amount, String description) {
		User user = userDAO.findById("myntd").get();
		Wallet walletAdmin = walletDAO.findByUser(user);
		walletAdmin.setBalance(walletAdmin.getBalance().add(amount));
		walletDAO.save(walletAdmin);
		//transaction
		Transaction tran = new Transaction();
		tran.setWallet(walletAdmin);
		tran.setAmount(amount);
		tran.setCreatedAt(LocalDateTime.now());
		tran.setDescription(description);
		tran.setTransactionType("+" + amount);
		transactionService.create(tran);				
		return null;
	}
	
}
