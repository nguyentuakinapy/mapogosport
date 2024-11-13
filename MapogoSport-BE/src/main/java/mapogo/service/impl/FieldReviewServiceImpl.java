package mapogo.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.FieldReviewDAO;
import mapogo.dao.SportFieldDAO;
import mapogo.dto.FieldReviewDTO;
import mapogo.entity.FieldReview;
import mapogo.entity.SportField;
import mapogo.service.FieldReviewService;

@Service
public class FieldReviewServiceImpl implements FieldReviewService {
	@Autowired
	FieldReviewDAO fieldReviewDAO;
	@Autowired
	UserServiceImpl userImpl;
	@Autowired
	SportFieldDAO sportFiledDao;

	@Override
	public List<FieldReview> findByUser_Username(String username) {
		return fieldReviewDAO.findByUser_Username(username);
	}

	@Override
	public List<FieldReview> findBySportField_SportFieldId(Integer id) {

		return fieldReviewDAO.findBySportField_SportFieldId(id);
	}

	@Override
	public FieldReview createReview(FieldReviewDTO reviewDto) {
		FieldReview review = new FieldReview();
		review.setUser(userImpl.findByUsername(reviewDto.getUsername()));

		SportField sportField = sportFiledDao.findById(reviewDto.getSportFieldId()).get();

		review.setSportField(sportField);
		review.setRating(reviewDto.getRating());
		review.setComment(reviewDto.getComment());
		review.setDatedAt(LocalDateTime.now());

		return fieldReviewDAO.save(review);

	}

	@Override
	public void deleteReviewByUser(Integer fieldReviewId) {
		fieldReviewDAO.deleteById(fieldReviewId);
	}

	@Override
	public List<FieldReview> findReviewByRating(Integer productId, Integer rating) {

		return fieldReviewDAO.FindReviewByRating(productId, rating);
	}

	@Override
	public Optional<FieldReview> findBySportField_SportFieldIdAndUser_Username(Integer fieldId, String username) {

		return fieldReviewDAO.findBySportField_SportFieldIdAndUser_Username(fieldId, username);
	}

}
