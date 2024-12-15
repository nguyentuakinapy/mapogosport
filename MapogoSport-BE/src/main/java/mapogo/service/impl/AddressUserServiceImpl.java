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
import mapogo.entity.PhoneNumberUser;
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
		boolean userHasAddress = !addressUserDAO.findByUser_Username(username).isEmpty();
		for (AddressUser addressUser : newAddress) {
	        addressUser.setUser(user);
	        addressUser.setActive(!userHasAddress);
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
	        userHasAddress = true;
	        savedAddressUsers.add(addressUserDAO.save(addressUser));
	    }
		return savedAddressUsers;
	}

	@Transactional
	@Override
	public void deleteAddressByUser(Integer addressUserId) {
		AddressUser addressUser = addressUserDAO.findById(addressUserId).get();
		
		if (addressUser.getActive()) { // Nếu địa chỉ có active true
			// Tìm các địa chỉ khác
			List<AddressUser> otherAddressUsers = addressUserDAO.findByUser_Username(addressUser.getUser().getUsername());
			for (AddressUser otherAddress: otherAddressUsers) {
				if (!otherAddress.getAddressUserId().equals(addressUserId)) {
					otherAddress.setActive(true);
					addressUserDAO.save(otherAddress);
					break; // chỉ cập nhật một số
				}
			}
		}
		addressUserDAO.deleteByAddressUserId(addressUserId);
		
		Integer addressId = addressUser.getAddress().getAddressId();
		boolean isAddressUsed = addressUserDAO.existsByAddress_AddressId(addressId);
		if (!isAddressUsed) {
	        addressDAO.deleteById(addressId);
	    }
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

	@Override
	public AddressUser updateStatusAddressUser(Integer addressUserId, AddressUser updateAdress) {
		AddressUser addressUser = addressUserDAO.findById(addressUserId).get();
	    if (updateAdress.getActive() != null) {
	        boolean isCurrentlyActive = addressUser.getActive();

	        if (isCurrentlyActive && !updateAdress.getActive()) { // Nếu đang active=true
	            // Tìm địa chỉ khác có active=false
	            List<AddressUser> otherAddressUsers = addressUserDAO.findByUser_Username(addressUser.getUser().getUsername());
	            for (AddressUser otherAdressUser : otherAddressUsers) {
	                if (!otherAdressUser.getAddressUserId().equals(addressUserId) && !otherAdressUser.getActive()) {
	                	otherAdressUser.setActive(true);
	                    addressUserDAO.save(otherAdressUser);
	                    break;
	                }
	            }
	            addressUser.setActive(false);
	        } else if (!isCurrentlyActive && updateAdress.getActive()) { // Nếu đang active=false
	            // Tìm và đặt tất cả các số khác về active=false
	            List<AddressUser> otherAddressUsers = addressUserDAO.findByUser_Username(addressUser.getUser().getUsername());
	            for (AddressUser otherAdressUser : otherAddressUsers) {
	                if (!otherAdressUser.getAddressUserId().equals(addressUserId) && otherAdressUser.getActive()) {
	                	otherAdressUser.setActive(false);
	                	addressUserDAO.save(otherAdressUser);
	                }
	            }
	            addressUser.setActive(true);
	        }
	    }
		
		return addressUserDAO.save(addressUser);
	}
}
