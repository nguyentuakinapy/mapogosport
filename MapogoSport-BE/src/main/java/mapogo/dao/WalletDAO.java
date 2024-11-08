package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.User;
import mapogo.entity.Wallet;

public interface WalletDAO extends JpaRepository<Wallet, Integer> {
	Wallet findByUser(User user);
}
