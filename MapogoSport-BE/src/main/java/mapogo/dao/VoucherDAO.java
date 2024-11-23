package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mapogo.entity.Voucher;

public interface VoucherDAO extends JpaRepository<Voucher, Integer> {
	Voucher findByName(String name);

	List<Voucher> findByDiscountPercent(Integer discountPercent);

	@Query("SELECT v " + "FROM Voucher v " + "WHERE CAST(v.activeDate AS DATE) = CAST(GETDATE() AS DATE)")
	List<Voucher> selectVoucherActive();

	@Query("SELECT v FROM Voucher v ORDER BY v.id DESC")
	List<Voucher>  findLatestVoucher();
	
}
