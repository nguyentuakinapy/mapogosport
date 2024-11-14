package mapogo.service;

import java.util.List;

import mapogo.entity.Transaction;

public interface TransactionService {
	//của Mỵ từ đây
	Transaction create(Transaction transaction);
	
	//đến đây
	
	List<Transaction> findTransactionByWalletId(Integer walletId);
}
