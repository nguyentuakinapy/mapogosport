package mapogo.service.impl;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.VoucherDAO;
import mapogo.entity.User;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.service.UserVoucherService;
import mapogo.service.VoucherService;

@Service
public class VoucherServiceImpl implements VoucherService{

	@Autowired
	VoucherDAO dao;
	@Override
	public Voucher findByName(String name) {
		return dao.findByName(name);
	}

	@Override
	public List<Voucher> findByDiscountPercent(Integer discountPercent) {
		return dao.findByDiscountPercent(discountPercent);
	}

	@Override
	public List<Voucher> selectVoucherActive() {
		return dao.selectVoucherActive();
	}

	@Override
	public List<Voucher> finAll() {
		// TODO Auto-generated method stub
//		return dao.findAll(); của Mỵ
//		QA 14/10
		 // Lấy tất cả voucher từ cơ sở dữ liệu
	    List<Voucher> vouchers = dao.findLatestVoucher();
	    LocalDate today = LocalDate.now();
        System.err.println("todayi" + today);


	    // Kiểm tra và cập nhật trạng thái hết hạn
	    for (Voucher voucher : vouchers) {
//	    	System.err.println("voucher end date "+ voucher.getEndDate());
	        if (voucher.getEndDate() != null && voucher.getEndDate().toLocalDate().isBefore(today) || voucher.getEndDate().toLocalDate().isEqual(today) ) {
	            voucher.setStatus("inactive");
	            dao.save(voucher); // Lưu lại trạng thái mới
	        }
//	        else if(voucher.getActiveDate().toLocalDate().isEqual(today)) {
//	        	System.err.println("ngày bằng nhau có id là "+ voucher.getVoucherId());
//	        	System.err.println("ngày bằng nhau có id là "+ voucher.getVoucherId());
//	        }
	    }

	    return vouchers;
		
	}

	//của Mỵ từ đây
	@Autowired
	UserVoucherService userVoucherService;
	@Override
	public Voucher findById(int id) {
		return dao.findById(id).get();
	}
	//đến đây

	@Override
	public void save(Voucher voucher) {
		// TODO Auto-generated method stub
		 dao.save(voucher);
	}

	

	
	// mới
	@Override
	public Voucher createVoucher(Map<String, Object> bd) {
	    System.err.println("Dữ liệu nhận được từ client: " + bd);

	    Voucher voucher = new Voucher();
	    voucher.setName((String) bd.get("name"));

	    Object discountPercentObj = bd.get("discountPercent");
	    if (discountPercentObj instanceof String) {
	        voucher.setDiscountPercent(Integer.valueOf((String) discountPercentObj));
	    } else if (discountPercentObj instanceof Integer) {
	        voucher.setDiscountPercent((Integer) discountPercentObj);
	    }

	    Object quantityObj = bd.get("quantity");
	    if (quantityObj instanceof String) {
	        voucher.setQuantity(Integer.valueOf((String) quantityObj));
	    } else if (quantityObj instanceof Integer) {
	        voucher.setQuantity((Integer) quantityObj);
	    }

	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

	    // Chuyển đổi CreateDate
	    Object createDateObj = bd.get("createDate");
	    LocalDateTime createDate = null;
	    if (createDateObj instanceof String) {
	        try {
	            Date date = dateFormat.parse((String) createDateObj);
	            createDate = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    } else if (createDateObj instanceof Date) {
	        createDate = LocalDateTime.ofInstant(((Date) createDateObj).toInstant(), ZoneId.systemDefault());
	    }
	    voucher.setCreateDate(createDate);

	    // Chuyển đổi EndDate
	    Object endDateObj = bd.get("endDate");
	    LocalDateTime endDate = null;
	    if (endDateObj instanceof String) {
	        try {
	            Date date = dateFormat.parse((String) endDateObj);
	            endDate = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    } else if (endDateObj instanceof Date) {
	        endDate = LocalDateTime.ofInstant(((Date) endDateObj).toInstant(), ZoneId.systemDefault());
	    }
	    voucher.setEndDate(endDate);

	    voucher.setStatus((String) bd.get("status"));
	    voucher.setDiscountCode((String) bd.get("discountCode"));

	    // Chuyển đổi ActiveDate
	    Object activeDateObj = bd.get("activeDate");
	    LocalDateTime activeDate = null;
	    if (activeDateObj instanceof String) {
	        try {
	            Date date = dateFormat.parse((String) activeDateObj);
	            activeDate = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    } else if (activeDateObj instanceof Date) {
	        activeDate = LocalDateTime.ofInstant(((Date) activeDateObj).toInstant(), ZoneId.systemDefault());
	    }
	    voucher.setActiveDate(activeDate);

	    if (voucher.getActiveDate().isEqual(voucher.getCreateDate())) {
	        voucher.setStatus("active");
	    }
	    User u = new User()	;
	    u.setUsername((String) bd.get("createdBy"));
	    
	    System.err.println("create By "+ u.getUsername());
	    voucher.setCreatedBy(u);

	    return dao.save(voucher);
	}
	//

	@Override
	public Voucher updateVoucher(Integer id, Map<String, Object> bd) {
	    System.err.println("Dữ liệu nhận được từ client để cập nhật: " + bd);

	    Voucher voucher = dao.findById(id).orElseThrow(() -> new IllegalArgumentException("Voucher not found with id: " + id));

	    if (bd.containsKey("name")) {
	        voucher.setName((String) bd.get("name"));
	    }

	    if (bd.containsKey("discountPercent")) {
	        Object discountPercentObj = bd.get("discountPercent");
	        if (discountPercentObj instanceof String) {
	            voucher.setDiscountPercent(Integer.valueOf((String) discountPercentObj));
	        } else if (discountPercentObj instanceof Integer) {
	            voucher.setDiscountPercent((Integer) discountPercentObj);
	        }
	    }

	    if (bd.containsKey("quantity")) {
	        Object quantityObj = bd.get("quantity");
	        if (quantityObj instanceof String) {
	            voucher.setQuantity(Integer.valueOf((String) quantityObj));
	        } else if (quantityObj instanceof Integer) {
	            voucher.setQuantity((Integer) quantityObj);
	        }
	    }

	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
	    dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));

	    // Cập nhật CreateDate nếu có
	    if (bd.containsKey("createDate")) {
	        Object createDateObj = bd.get("createDate");
	        LocalDateTime createDate = null;
	        if (createDateObj instanceof String) {
	            try {
	                Date date = dateFormat.parse((String) createDateObj);
	                createDate = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        } else if (createDateObj instanceof Date) {
	            createDate = LocalDateTime.ofInstant(((Date) createDateObj).toInstant(), ZoneId.systemDefault());
	        }
	        voucher.setCreateDate(createDate);
	    }

	    // Cập nhật EndDate nếu có
	    if (bd.containsKey("endDate")) {
	        Object endDateObj = bd.get("endDate");
	        LocalDateTime endDate = null;
	        if (endDateObj instanceof String) {
	            try {
	                Date date = dateFormat.parse((String) endDateObj);
	                endDate = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        } else if (endDateObj instanceof Date) {
	            endDate = LocalDateTime.ofInstant(((Date) endDateObj).toInstant(), ZoneId.systemDefault());
	        }
	        voucher.setEndDate(endDate);
	    }

	    if (bd.containsKey("status")) {
	        voucher.setStatus((String) bd.get("status"));
	        System.err.println("voucher.get Status "+ voucher.getStatus());
	    }

	    if (bd.containsKey("discountCode")) {
	        voucher.setDiscountCode((String) bd.get("discountCode"));
	    }

	    // Cập nhật ActiveDate nếu có
	    if (bd.containsKey("activeDate")) {
	        Object activeDateObj = bd.get("activeDate");
	        LocalDateTime activeDate = null;
	        if (activeDateObj instanceof String) {
	        	System.err.println("chạy vo day");
	            try {
	                Date date = dateFormat.parse((String) activeDateObj);
	                activeDate = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        } else if (activeDateObj instanceof Date) {
	            activeDate = LocalDateTime.ofInstant(((Date) activeDateObj).toInstant(), ZoneId.systemDefault());
	        }
	        voucher.setActiveDate(activeDate);

	        
//	        if (voucher.getActiveDate().isEqual(voucher.getCreateDate())) {
//	            voucher.setStatus("active");
//	        }else if(voucher.getActiveDate().isAfter(voucher.getCreateDate())) {
//	        	voucher.setStatus("inactive");
//	        }
	        // So sánh theo LocalDate (không bao gồm giờ)
	        LocalDate activeDateOnly = voucher.getActiveDate().toLocalDate();
	        LocalDate createDateOnly = voucher.getCreateDate().toLocalDate();
	        LocalDate endDateOnly = voucher.getEndDate().toLocalDate();
	        LocalDate curentDateOnly = LocalDate.now();

	        System.err.println("createDateOnly "+ createDateOnly);
	        System.err.println("activeDateOnly "+ activeDateOnly);
		    System.err.println("endDateOnly day "+ endDateOnly);
		    System.err.println("curentDateOnly "+curentDateOnly);

		    
//		    if ((curentDateOnly.isEqual(activeDateOnly) || curentDateOnly.isAfter(activeDateOnly)) && 
//		    	    (curentDateOnly.isEqual(endDateOnly) || curentDateOnly.isBefore(endDateOnly))) {
//		    	    voucher.setStatus("active");
//		    	} else {
//		    	    voucher.setStatus("inactive");
//		    	}
			if(bd.containsKey("flag")) {
				 voucher.setStatus("inactive");
			}else {
				    if (activeDateOnly.equals(createDateOnly) && 
					    	    activeDateOnly.equals(endDateOnly) && 
					    	    curentDateOnly.equals(activeDateOnly)) {
					    	    // Trường hợp tất cả ngày trùng nhau, đặt là "inactive"
					    	    voucher.setStatus("inactive");
					    	} else if ((curentDateOnly.isEqual(activeDateOnly) || curentDateOnly.isAfter(activeDateOnly)) && 
					    	           (curentDateOnly.isEqual(endDateOnly) || curentDateOnly.isBefore(endDateOnly))) {
					    	    voucher.setStatus("active");
					    	} else {
					    	    voucher.setStatus("inactive");
					    	}
			}
		

	    }
	    
	    if (bd.containsKey("createdBy")) {
	    	  User u = new User()	;
	  	    u.setUsername((String) bd.get("createdBy"));	  	    
	  	    System.err.println("create By Update"+ u.getUsername());
	  	    
	  	    voucher.setCreatedBy(u);
//	        voucher.setCreatedBy();
	    }
	    System.err.println("active day "+ voucher.getActiveDate());
	    System.err.println("getCreateDate day "+ voucher.getCreateDate());
	    System.err.println("voucher cuoisi "+ voucher.getStatus());

	    return dao.save(voucher);
//	    return null;
	}


	@Override
	public Voucher deleteVoucher(Integer voucherId) { // sử dụng soft delete
	    Voucher voucher = dao.findById(voucherId)
	            .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
	        
	    // Kiểm tra và cập nhật trạng thái voucher
	    if (voucher.getStatus().equalsIgnoreCase("active")) {
	        voucher.setStatus("inactive");
//	        LocalDateTime now = LocalDateTime.now();
//	        
//	        // Chỉ cập nhật endDate thành ngày hiện tại nếu voucher chưa hết hạn
//	        if (voucher.getEndDate().isAfter(now)) {
//	            voucher.setEndDate(now);
//	        }
	    }
	    
	    return dao.save(voucher);
	}


}
