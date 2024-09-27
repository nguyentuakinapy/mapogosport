package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Gallery;

public interface GalleryDAO extends JpaRepository<Gallery, Integer>{

}
