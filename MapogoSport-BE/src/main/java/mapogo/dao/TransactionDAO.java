package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Transaction;

public interface TransactionDAO extends JpaRepository<Transaction, Integer>{

}
