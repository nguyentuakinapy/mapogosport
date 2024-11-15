package mapogo.service;

import java.util.List;

import mapogo.entity.Transaction;
import mapogo.entity.Wallet;

public interface TransactionService {
	//của Mỵ từ đây
	Transaction create(Transaction transaction);
	
	//đến đây
	
	List<Transaction> findTransactionByWalletId(Integer walletId);

	void createTransactionByPaymentBooking(Integer bookingId, double totalAmount);
	
//	void updateWalletBalanceAndCreateTransaction(Wallet wallet, Integer amount, String description);
}
