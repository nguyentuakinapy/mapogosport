package mapogo.service;

import java.util.List;

import mapogo.entity.UserVoucher;

public interface UserVoucherService {
	UserVoucher createUserVoucher(UserVoucher userVoucher);
	List<UserVoucher> findUserVoucher();
}
