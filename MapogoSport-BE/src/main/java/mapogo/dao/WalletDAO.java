package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Wallet;

public interface WalletDAO extends JpaRepository<Wallet, Integer> {

}
