package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.UserVoucher;

public interface UserVoucherDAO extends JpaRepository<UserVoucher, Integer> {
	boolean existsByUser_UsernameAndVoucher_VoucherId(String username, Integer voucherId);

	List<UserVoucher> findByUser_Username(String username);

	// của Mỵ từ đây
	UserVoucher findByUser_UsernameAndVoucher_VoucherId(String username, Integer voucherId);
	// đến đây
}
