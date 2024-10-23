package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.UserVoucher;

public interface UserVoucherDAO extends JpaRepository<UserVoucher, Integer>{

}
