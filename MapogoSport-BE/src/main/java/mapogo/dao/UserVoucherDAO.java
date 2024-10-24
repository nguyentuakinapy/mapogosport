package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.User;
import mapogo.entity.UserVoucher;

public interface UserVoucherDAO extends JpaRepository<UserVoucher, Integer>{
	boolean existsByUser_UsernameAndVoucher_VoucherId(String username, Integer voucherId);
}
