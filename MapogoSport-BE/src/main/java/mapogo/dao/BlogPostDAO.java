package mapogo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.BlogPost;

public interface BlogPostDAO extends JpaRepository<BlogPost, Integer>{

}
