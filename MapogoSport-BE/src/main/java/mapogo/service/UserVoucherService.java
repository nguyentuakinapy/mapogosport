package mapogo.service;

import java.util.List;
import java.util.Map;

import mapogo.entity.UserVoucher;

public interface UserVoucherService {
	List<Map<String, Object>> findByUser(String username);
	UserVoucher createUserVoucher(UserVoucher userVoucher);
	List<UserVoucher> findUserVoucher();
	public boolean checkUserVoucher(String username, Integer voucherId);
	
	//của Mỵ từ đây
	UserVoucher findByUserVoucherId(int userVoucherId);	
	UserVoucher update(UserVoucher userVoucher);
	//đến đây
}
