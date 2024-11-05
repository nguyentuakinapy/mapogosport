package mapogo.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mapogo.dao.AddressDAO;
import mapogo.dao.AddressUserDAO;
import mapogo.dao.UserDAO;
import mapogo.entity.Address;
import mapogo.entity.AddressUser;
import mapogo.entity.User;
import mapogo.service.AddressUserService;

@Service
public class AddressUserServiceImpl implements AddressUserService{
	@Autowired
	AddressUserDAO addressUserDAO;
	@Autowired
	UserDAO userDAO;
	@Autowired
	AddressDAO addressDAO;

	@Override
    public List<AddressUser> findByUsername(String username) {
        return addressUserDAO.findByUser_Username(username);
    }

	@Override
	public List<AddressUser> addAddressByUsername(String username, List<AddressUser> newAddress) {
		User user = userDAO.findById(username).get();
		List<AddressUser> savedAddressUsers = new ArrayList<>();
		for (AddressUser addressUser : newAddress) {
	        addressUser.setUser(user);
	        Address address = addressUser.getAddress();
	        // Tìm kiếm địa chỉ đã tồn tại
	        Address existedAddress = addressDAO.findExistedAddress(
	            address.getWard(), 
	            address.getDistrict(), 
	            address.getProvince()
	        );
	        if (existedAddress != null) { // Nếu địa chỉ đã tồn tại thì sử dụng dữ liệu cũ
				addressUser.setAddress(existedAddress);
			} else {
				address = addressDAO.save(address); // Lưu địa chỉ mới
	            addressUser.setAddress(address);
			}
	        savedAddressUsers.add(addressUserDAO.save(addressUser));
	    }
		return savedAddressUsers;
	}

	@Transactional
	@Override
	public void deleteAddressByUser(Integer addressUserId) {
		addressUserDAO.deleteByAddressUserId(addressUserId);
	}

	@Override
	public AddressUser updateAddressUser(Integer addressUserId, AddressUser updateAddress) {
	    Optional<AddressUser> currentAddresses = addressUserDAO.findById(addressUserId);
	    AddressUser currentAddress = currentAddresses.get();
	    Address newAddress = updateAddress.getAddress(); // Lấy địa chỉ từ updateAddress
	    // Kiểm tra xem địa chỉ mới đã tồn tại trong cơ sở dữ liệu hay chưa
	    Address existedAddress = addressDAO.findExistedAddress(
	        newAddress.getWard(), 
	        newAddress.getDistrict(), 
	        newAddress.getProvince()
	    );
	    if (existedAddress != null) {// Nếu địa chỉ đã tồn tại, sử dụng địa chỉ đã có
	        currentAddress.setAddress(existedAddress);
	    } else {
	        Address savedAddress = addressDAO.save(newAddress);
	        currentAddress.setAddress(savedAddress);
	    }
	    currentAddress.setAddressDetail(updateAddress.getAddressDetail());
	    return addressUserDAO.save(currentAddress);
	}
}
