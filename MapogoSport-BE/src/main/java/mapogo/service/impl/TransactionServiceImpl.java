package mapogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.TransactionDAO;
import mapogo.entity.Transaction;
import mapogo.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService{

	@Autowired
	TransactionDAO transactionDAO;
	@Override
	public Transaction create(Transaction transaction) {
		return transactionDAO.save(transaction);
	}

}