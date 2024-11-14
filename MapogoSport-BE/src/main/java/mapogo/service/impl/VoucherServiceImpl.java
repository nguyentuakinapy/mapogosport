package mapogo.service.impl;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.VoucherDAO;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.service.UserService;
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
		return dao.findAll();
	}

	//của Mỵ từ đây
	@Autowired
	UserVoucherService userVoucherService;
	@Override
	public Voucher findById(int id) {
		return dao.findById(id).get();
	}

	@Override
	public List<Voucher> findByUserName(String username) {
		List<UserVoucher> userVouchers = userVoucherService.findByUsername(username);
		List<UserVoucher> unusedVouchers = userVouchers.stream()
			    .filter(voucher -> "Unused".equals(voucher.getStatus())) 
			    .collect(Collectors.toList());
		List<Voucher> vouchers =  new ArrayList<>();
		for (UserVoucher userVoucher : unusedVouchers) {
			Voucher voucher = userVoucher.getVoucher();
		    if (voucher.getEndDate().isAfter(LocalDateTime.now())) { 
		        vouchers.add(voucher); 
		    }		}
		return vouchers;
	}
	//đến đây

	@Override
	public Voucher createVoucher(Map<String, Object> bd) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Voucher updateVoucher(Integer id, Map<String, Object> bd) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Voucher deleteVoucher(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	
//	@Override
//	public Voucher createVoucher(Map<String, Object> bd) {
//	    // In ra dữ liệu nhận được từ phía client
//	    System.err.println("Dữ liệu nhận được từ client: " + bd);
//
//	    // Khởi tạo đối tượng Voucher
//	    Voucher voucher = new Voucher();
//
//	    // Lấy các giá trị từ Map và chuyển đổi về đúng kiểu dữ liệu
//	    voucher.setName((String) bd.get("name"));
//
//	    // Kiểm tra và chuyển đổi giá trị discountPercent
//	    Object discountPercentObj = bd.get("discountPercent");
//	    if (discountPercentObj instanceof String) {  // instanceof là so sánh kiễu nếu cùng kiễu thì là true
//	        voucher.setDiscountPercent(Integer.valueOf((String) discountPercentObj)); // Chuyển từ String sang Integer
//	    } else if (discountPercentObj instanceof Integer) {
//	        voucher.setDiscountPercent((Integer) discountPercentObj);
//	    }
//
//	    // Kiểm tra và chuyển đổi giá trị quantity
//	    Object quantityObj = bd.get("quantity");
//	    if (quantityObj instanceof String) {
//	        voucher.setQuantity(Integer.valueOf((String) quantityObj)); // Chuyển từ String sang Integer
//	    } else if (quantityObj instanceof Integer) {
//	        voucher.setQuantity((Integer) quantityObj);
//	    }
//
//	    // Chuyển đổi kiểu dữ liệu cho các trường Date
//	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//
//	    // Chuyển đổi CreateDate
//	    Object createDateObj = bd.get("createDate");
//	    Date createDate = null;
//	    if (createDateObj instanceof String) {  
//	        try {
//	            createDate = dateFormat.parse((String) createDateObj); // Chuyển đổi String thành Date
//	        } catch (Exception e) {
//	            e.printStackTrace();
//	        }
//	    } else if (createDateObj instanceof Date) {
//	        createDate = (Date) createDateObj;
//	    }
//	    voucher.setCreateDate(createDate);
//
//	    // Chuyển đổi EndDate
//	    Object endDateObj = bd.get("endDate");
//	    Date endDate = null;
//	    if (endDateObj instanceof String) {
//	        try {
//	            endDate = dateFormat.parse((String) endDateObj); // Chuyển đổi String thành Date
//	        } catch (Exception e) {
//	            e.printStackTrace();
//	        }
//	    } else if (endDateObj instanceof Date) {
//	        endDate = (Date) endDateObj;
//	    }
//	    voucher.setEndDate(endDate);
//
//	    voucher.setStatus((String) bd.get("status"));
//	    voucher.setDiscountCode((String) bd.get("discountCode"));
//
//	    // Chuyển đổi ActiveDate
//	    Object activeDateObj = bd.get("activeDate");
//	    Date activeDate = null;
//	    if (activeDateObj instanceof String) {
//	        try {
//	        	System.err.println(("là kiểu string"));
//	            activeDate = dateFormat.parse((String) activeDateObj); // Chuyển đổi String thành Date
//	        } catch (Exception e) {
//	            e.printStackTrace();
//	        }
//	    } else if (activeDateObj instanceof Date) {
//
//	        activeDate = (Date) activeDateObj;
//	    }
//	    voucher.setActiveDate(activeDate);
//	    
//	    if(voucher.getActiveDate().getTime() == voucher.getCreateDate().getTime()) {
//	    	voucher.setStatus("active");
//	    };
//
//	    voucher.setCreatedBy((String) bd.get("createdBy"));
//
//	    // Lưu voucher vào cơ sở dữ liệu
//	    return dao.save(voucher);
//	}
	
//	@Override
//	public Voucher updateVoucher(Integer id, Map<String, Object> bd) {
//	    // In ra dữ liệu nhận được từ phía client
//	    System.err.println("Dữ liệu nhận được từ client để cập nhật: " + bd);
//
//	    // Lấy voucher cần cập nhật từ cơ sở dữ liệu
//	    Voucher voucher = dao.findById(id).orElseThrow(() -> new IllegalArgumentException("Voucher not found with id: " + id));
//
//	    // Cập nhật các trường trong voucher từ Map bd
//	    if (bd.containsKey("name")) {
//	        voucher.setName((String) bd.get("name"));
//	    }
//
//	    // Kiểm tra và chuyển đổi giá trị discountPercent
//	    if (bd.containsKey("discountPercent")) {
//	        Object discountPercentObj = bd.get("discountPercent");
//	        if (discountPercentObj instanceof String) {
//	            voucher.setDiscountPercent(Integer.valueOf((String) discountPercentObj)); // Chuyển từ String sang Integer
//	        } else if (discountPercentObj instanceof Integer) {
//	            voucher.setDiscountPercent((Integer) discountPercentObj);
//	        }
//	    }
//
//	    // Kiểm tra và chuyển đổi giá trị quantity
//	    if (bd.containsKey("quantity")) {
//	        Object quantityObj = bd.get("quantity");
//	        if (quantityObj instanceof String) {
//	            voucher.setQuantity(Integer.valueOf((String) quantityObj)); // Chuyển từ String sang Integer
//	        } else if (quantityObj instanceof Integer) {
//	            voucher.setQuantity((Integer) quantityObj);
//	        }
//	    }
//
//	    // Chuyển đổi kiểu dữ liệu cho các trường Date
////	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
//	    dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
////
//	    // Cập nhật CreateDate nếu có
//	    if (bd.containsKey("createDate")) {
//	        Object createDateObj = bd.get("createDate");
//	        Date createDate = null;
//	        if (createDateObj instanceof String) {
//	            try {
//	                createDate = dateFormat.parse((String) createDateObj); // Chuyển đổi String thành Date
//	            } catch (Exception e) {
//	                e.printStackTrace();
//	            }
//	        } else if (createDateObj instanceof Date) {
//	            createDate = (Date) createDateObj;
//	        }
//	        voucher.setCreateDate(createDate);
//	    }
//
//	    // Cập nhật EndDate nếu có
//	    if (bd.containsKey("endDate")) {
//	        Object endDateObj = bd.get("endDate");
//	        Date endDate = null;
//	        if (endDateObj instanceof String) {
//	            try {
//	                endDate = dateFormat.parse((String) endDateObj); // Chuyển đổi String thành Date
//	            } catch (Exception e) {
//	                e.printStackTrace();
//	            }
//	        } else if (endDateObj instanceof Date) {
//	            endDate = (Date) endDateObj;
//	        }
//	        voucher.setEndDate(endDate);
//	    }
//
//	    // Cập nhật status và discountCode nếu có
//	    if (bd.containsKey("status")) {
//	        voucher.setStatus((String) bd.get("status"));
//	    }
//
//	    if (bd.containsKey("discountCode")) {
//	        voucher.setDiscountCode((String) bd.get("discountCode"));
//	    }
//
//	    // Cập nhật ActiveDate nếu có
//	    if (bd.containsKey("activeDate")) {
//	        Object activeDateObj = bd.get("activeDate");
//	        Date activeDate = null;
//	        if (activeDateObj instanceof String) {
//	            try {
//	                activeDate = dateFormat.parse((String) activeDateObj); // Chuyển đổi String thành Date
//	            } catch (Exception e) {
//	                e.printStackTrace();
//	            }
//	        } else if (activeDateObj instanceof Date) {
//	            activeDate = (Date) activeDateObj;
//	        }
//	        voucher.setActiveDate(activeDate);
//	        
//	        if(voucher.getActiveDate().getTime() == voucher.getCreateDate().getTime()) {
//		    	voucher.setStatus("active");
//		    };
//	    }
//
//	    // Cập nhật CreatedBy nếu có
//	    if (bd.containsKey("createdBy")) {
//	        voucher.setCreatedBy((String) bd.get("createdBy"));
//	    }
//
//	    // Lưu voucher đã cập nhật vào cơ sở dữ liệu
//	    return dao.save(voucher);
//	}

//	@Override
//	public Voucher deleteVoucher(Integer voucherId) { // sử dụng soft delete
//	    Voucher voucher = dao.findById(voucherId)
//	            .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
//	        
//	    // Kiểm tra và cập nhật trạng thái voucher
//	    if (voucher.getStatus().equalsIgnoreCase("active")) {
//	        voucher.setStatus("inactive");
//
//	        // Chỉ cập nhật endDate thành ngày hiện tại nếu voucher chưa hết hạn
//	        if (voucher.getEndDate().after(new Date())) {
//	            voucher.setEndDate(new Date());
//	        }
//	    }
//	    
//	    return dao.save(voucher);
//	}




}
