package mapogo.service;

import java.util.List;

import mapogo.entity.User;
import mapogo.entity.UserVoucher;

public interface UserVoucherService {
	UserVoucher createUserVoucher(UserVoucher userVoucher);
	List<UserVoucher> findUserVoucher();
	public boolean checkUserVoucher(String username, Integer voucherId);
}
