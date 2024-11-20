package mapogo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import mapogo.dao.BookingDAO;
import mapogo.dao.TransactionDAO;
import mapogo.dao.WalletDAO;
import mapogo.entity.Booking;
import mapogo.entity.Transaction;
import mapogo.entity.Wallet;
import mapogo.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService{
	@Autowired
	TransactionDAO transactionDAO;
	@Autowired
	BookingDAO bookingDAO;
	@Autowired
	WalletDAO walletDAO;
	
	@Override
	public Transaction create(Transaction transaction) {
		return transactionDAO.save(transaction);
	}
	
	@Override
	public List<Transaction> findTransactionByWalletId(Integer walletId) {
		return transactionDAO.findByWallet_WalletId(walletId);
	}
	
	@Transactional
	@Override
	public void createTransactionUserByPaymentBooking(Integer bookingId, double totalAmount) {
		Booking booking = bookingDAO.findById(bookingId).get();
		
		Wallet wallet = booking.getUser().getWallet();
		wallet.setBalance(wallet.getBalance().subtract(BigDecimal.valueOf(totalAmount)));
		
		Transaction transaction = new Transaction();
		transaction.setAmount(BigDecimal.valueOf(totalAmount));
		transaction.setCreatedAt(LocalDateTime.now());
		transaction.setDescription("Thanh toán cho bookingId: " + bookingId);
		transaction.setTransactionType("-" + totalAmount);
		transaction.setWallet(wallet);
		transactionDAO.save(transaction);
		walletDAO.save(wallet);
	}
	
	@Transactional
	@Override
	public void createTransactionOwnerByPaymentBooking(Integer bookingId, double totalAmount) {
		Booking booking = bookingDAO.findById(bookingId).get();
		
		Wallet wallet = booking.getOwner().getUser().getWallet();
		wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(totalAmount)));
		
		Transaction transaction = new Transaction();
		transaction.setAmount(BigDecimal.valueOf(totalAmount));
		transaction.setCreatedAt(LocalDateTime.now());
		transaction.setDescription("Được thanh toán từ bookingId: " + bookingId);
		transaction.setTransactionType("+" + totalAmount);
		transaction.setWallet(wallet);
		transactionDAO.save(transaction);
		walletDAO.save(wallet);
	}
	
	@Override
	public void refundUserWalletBooking(Wallet wallet, Integer amount, Integer bookingId) {
		wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(amount)));
	    
	    Transaction transaction = new Transaction();
	    transaction.setAmount(BigDecimal.valueOf(amount));
	    transaction.setCreatedAt(LocalDateTime.now());
	    transaction.setDescription("Hoàn tiền từ bookingId: " + bookingId);
	    transaction.setTransactionType("+" + amount);
	    transaction.setWallet(wallet);
	    
	    transactionDAO.save(transaction);
	    walletDAO.save(wallet);
	}
	
	@Override
	public void refundOwnerWalletBooking(Wallet wallet, Integer amount, Integer bookingId) {
		wallet.setBalance(wallet.getBalance().subtract(BigDecimal.valueOf(amount)));
	    
	    Transaction transaction = new Transaction();
	    transaction.setAmount(BigDecimal.valueOf(amount));
	    transaction.setCreatedAt(LocalDateTime.now());
	    transaction.setDescription("Hoàn tiền cho bookingId: " + bookingId);
	    transaction.setTransactionType("-" + amount);
	    transaction.setWallet(wallet);
	    
	    transactionDAO.save(transaction);
	    walletDAO.save(wallet);
	}
}
