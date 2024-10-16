package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.FieldReviewDAO;
import mapogo.entity.FieldReview;
import mapogo.service.FieldReviewService;

@Service
public class FieldReviewServiceImpl implements FieldReviewService{
	@Autowired
	FieldReviewDAO fieldReviewDAO;

	@Override
	public List<FieldReview> findByUser_Username(String username) {
		return fieldReviewDAO.findByUser_Username(username);
	}
}
