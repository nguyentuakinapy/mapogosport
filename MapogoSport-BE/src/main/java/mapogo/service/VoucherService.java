package mapogo.service;

import java.util.List;
import java.util.Map;

import mapogo.entity.Voucher;

public interface VoucherService {
	Voucher findByName(String name);
	List<Voucher> findByDiscountPercent(Integer discountPercent);
	List<Voucher> selectVoucherActive();
	
	List<Voucher>finAll();

	//của Mỵ từ đây
	Voucher findById(int id);
	
	Voucher createVoucher(Map<String, Object> bd);
	//đến đây

	void save(Voucher voucher);

	Voucher updateVoucher(Integer id, Map<String, Object> bd); // QA
	
	Voucher deleteVoucher (Integer id); 

}
