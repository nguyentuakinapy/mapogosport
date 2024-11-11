package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Size;

public interface SizeDAO extends JpaRepository<Size, Integer>{
    Size findBySizeName(String sizeName); // Tìm kích cỡ theo tên

}
