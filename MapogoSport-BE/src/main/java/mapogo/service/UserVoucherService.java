package mapogo.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.Query;

import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;

public interface UserVoucherService {
//	List<Map<String, Object>> findByUser(String username);
	UserVoucher createUserVoucher(UserVoucher userVoucher);
	List<UserVoucher> findUserVoucher();
	public boolean checkUserVoucher(String username, Integer voucherId);
	
	//của Mỵ từ đây
	UserVoucher findByUser_UsernameAndVoucher_VoucherId(String username, Integer voucherId);	

	UserVoucher update(UserVoucher userVoucher);
	
	List<UserVoucher> findByUsername(String username);
	//đến đây
	List<Map<String, Object>> findByUserMap(String username);


}
