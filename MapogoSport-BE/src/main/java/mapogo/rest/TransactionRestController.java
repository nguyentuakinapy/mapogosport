package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Transaction;
import mapogo.service.TransactionService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class TransactionRestController {
	@Autowired
	TransactionService transactionService;
	
	@GetMapping("/wallet/transaction/{walletId}")
	public List<Transaction> getTransactions(@PathVariable("walletId") Integer walletId) {
		return transactionService.findTransactionByWalletId(walletId);
	}
	
}
