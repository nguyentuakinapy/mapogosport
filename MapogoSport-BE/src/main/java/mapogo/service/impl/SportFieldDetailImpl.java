package mapogo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.SportFieldDetailDAO;
import mapogo.dao.StatusSportFieldDetailDAO;
import mapogo.dto.SportFieldDetailDTO;
import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.StatusSportFieldDetails;
import mapogo.service.SportFieldDetailService;
import mapogo.service.SportFieldService;

@Service
public class SportFieldDetailImpl implements SportFieldDetailService {

	@Autowired
	SportFieldDetailDAO sportFieldDetailDAO;

	@Override
	public List<SportFieldDetail> findAll() {
		return sportFieldDetailDAO.findAll();
	}

	@Override
	public List<String> findSizeBySportFieldId(Integer sportFieldId) {
		// TODO Auto-generated method stub
		return sportFieldDetailDAO.findSizeBySportField(sportFieldId);
	}

	@Override
	public List<Object[]> findPriceBySize(Integer sportFieldId, String size) {
		// TODO Auto-generated method stub
		return sportFieldDetailDAO.findPriceBySize(sportFieldId, size);
	}

	@Override
	public List<SportFieldDetail> findBySportField(SportField sportField) {
		return sportFieldDetailDAO.findBySportField(sportField);
	}

	@Override
	public SportFieldDetail findBySportFielDetailId(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Autowired
	SportFieldService sportFieldService;
	
	@Autowired
	StatusSportFieldDetailDAO statusSportFieldDetailDAO;

	@Override
	public SportFieldDetail create(SportFieldDetailDTO dto) {
		SportFieldDetail item = new SportFieldDetail();
		item.setName(dto.getName());
		item.setPrice(dto.getPrice());
		item.setPeakHourPrices(dto.getPeakHourPrices());
		item.setSize(dto.getSize());
		item.setStatus(dto.getStatus());
		item.setPercentDeposit(dto.getPercentDeposit());
		item.setPeakHour(dto.getPeakHour());

		SportField sportField = sportFieldService.findBySportFieldId(dto.getSportFieldId());
		item.setSportField(sportField);
		sportFieldDetailDAO.save(item);
		
		LocalDateTime now = LocalDateTime.now();
		StatusSportFieldDetails newStatus = new StatusSportFieldDetails();
		newStatus.setStartDate(now);
		newStatus.setEndDate(null);
		newStatus.setStatusName(dto.getStatus());
		newStatus.setSportFieldDetail(item);
		
		statusSportFieldDetailDAO.save(newStatus);

		return item;
	}

	@Override
	public SportFieldDetail update(SportFieldDetailDTO dto) {
		SportFieldDetail item = sportFieldDetailDAO.findBySportFielDetailId(dto.getSportFieldDetailId());
		
		if (!item.getStatus().equals(dto.getStatus())) {
			for (StatusSportFieldDetails statusSportFieldDetails : item.getStatusSportFieldDetails()) {
				if (statusSportFieldDetails.getEndDate() == null) {
					LocalDateTime now = LocalDateTime.now();
					statusSportFieldDetails.setEndDate(now);
					StatusSportFieldDetails newStatus = new StatusSportFieldDetails();
					newStatus.setStartDate(now);
					newStatus.setEndDate(null);
					newStatus.setStatusName(dto.getStatus());
					newStatus.setSportFieldDetail(item);
					
					statusSportFieldDetailDAO.save(newStatus);
					
				}
			}
		}
		
		item.setName(dto.getName());
		item.setPrice(dto.getPrice());
		item.setPeakHourPrices(dto.getPeakHourPrices());
		item.setSize(dto.getSize());
		item.setStatus(dto.getStatus());
		item.setPercentDeposit(dto.getPercentDeposit());
		item.setPeakHour(dto.getPeakHour());

		sportFieldDetailDAO.save(item);

		return item;
	}

}
