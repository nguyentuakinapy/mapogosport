package mapogo.service;

import java.util.List;

import mapogo.entity.BookingDetail;

public interface BookingDetailService {

	List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId);

}
