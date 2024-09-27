package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Voucher;

public interface VoucherDAO extends JpaRepository<Voucher, Integer>{
	Voucher findByName(String name);
	List<Voucher> findByDiscountPercent(Integer discountPercent);
}
