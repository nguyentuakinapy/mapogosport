package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Transaction;
import mapogo.entity.Wallet;
import mapogo.service.TransactionService;
import mapogo.service.WalletService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class TransactionRestController {
	@Autowired
	TransactionService transactionService;
	
	@Autowired
	WalletService walletService;
	
	@GetMapping("/wallet/transaction/{walletId}")
	public List<Transaction> getTransactions(@PathVariable("walletId") Integer walletId) {
		return transactionService.findTransactionByWalletId(walletId);
	}
	
	@PostMapping("/wallet/{username}")
	public Wallet create(@PathVariable("username") String username) {
		return walletService.create(username);
	}
	
	@PutMapping("/wallet/create/owner/{username}/{price}")
	public Wallet updateWalletAndCreateTransaction(@PathVariable("username") String username, @PathVariable("price") Double price) {
		return walletService.updateWalletAndCreateTransaction(username, price);
	}
}
