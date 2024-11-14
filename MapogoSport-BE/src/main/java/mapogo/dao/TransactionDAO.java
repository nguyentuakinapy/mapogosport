package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Transaction;

public interface TransactionDAO extends JpaRepository<Transaction, Integer>{
	List<Transaction> findByWallet_WalletId(Integer walletId);
}
