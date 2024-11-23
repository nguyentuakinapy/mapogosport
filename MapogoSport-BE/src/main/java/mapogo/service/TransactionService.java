package mapogo.service;

import java.util.List;

import mapogo.entity.Transaction;
import mapogo.entity.Wallet;

public interface TransactionService {
	//của Mỵ từ đây
	Transaction create(Transaction transaction);
	
	//đến đây
	
	List<Transaction> findTransactionByWalletId(Integer walletId);

	void createTransactionUserByPaymentBooking(Integer bookingId, double totalAmount);
	
	void createTransactionOwnerByPaymentBooking(Integer bookingId, double totalAmount);

	void refundUserWalletBooking(Wallet wallet, Double amount, Integer bookingId);

	void refundOwnerWalletBooking(Wallet wallet, Double amount, Integer bookingId);
}
