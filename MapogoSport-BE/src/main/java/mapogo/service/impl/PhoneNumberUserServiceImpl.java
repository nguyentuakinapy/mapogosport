package mapogo.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mapogo.dao.PhoneNumberDAO;
import mapogo.dao.PhoneNumberUserDAO;
import mapogo.dao.UserDAO;
import mapogo.entity.PhoneNumber;
import mapogo.entity.PhoneNumberUser;
import mapogo.entity.User;
import mapogo.service.PhoneNumberUserService;

@Service
public class PhoneNumberUserServiceImpl implements PhoneNumberUserService{
	@Autowired
	PhoneNumberUserDAO phoneNumberUserDAO;
	@Autowired
	UserDAO userDAO;
	@Autowired
	PhoneNumberDAO phoneNumberDAO;
	
	@Transactional
	@Override
	public void deletePhoneNumberByUser(Integer phoneNumberUserId) {
		PhoneNumberUser phoneNumberUser = phoneNumberUserDAO.findById(phoneNumberUserId).get();
		
		if (phoneNumberUser.getActive()) { // Nếu sdt có active true
			// Tìm các sdt khác
			List<PhoneNumberUser> otherPhoneNumberUsers = phoneNumberUserDAO.findByUser_Username(phoneNumberUser.getUser().getUsername());
			for (PhoneNumberUser otherPhoneNumber: otherPhoneNumberUsers) {
				if (!otherPhoneNumber.getPhoneNumberUserId().equals(phoneNumberUserId)) {
					otherPhoneNumber.setActive(true);
					phoneNumberUserDAO.save(otherPhoneNumber);
					break; // chỉ cập nhật một số
				}
			}
		}
		
		phoneNumberUserDAO.deleteByPhoneNumberUserId(phoneNumberUserId);
		phoneNumberDAO.deleteById(phoneNumberUser.getPhoneNumber().getPhoneNumberId());
	}
	
	@Transactional
	@Override
	public List<PhoneNumberUser> addPhoneNumberByUsername(String username, List<PhoneNumberUser> newPhoneNumber) {
		User user = userDAO.findById(username).get();
		
		boolean userHasPhoneNumbers = !phoneNumberUserDAO.findByUser_Username(username).isEmpty();
		
		List<PhoneNumberUser> savePhoneNumberUser = new ArrayList<>();
		for(PhoneNumberUser phoneNumberUser: newPhoneNumber ) {
			phoneNumberUser.setUser(user);
			phoneNumberUser.setActive(!userHasPhoneNumbers);
			PhoneNumber phoneNumber = phoneNumberDAO.save(phoneNumberUser.getPhoneNumber());
			phoneNumberUser.setPhoneNumber(phoneNumber);
			savePhoneNumberUser.add(phoneNumberUserDAO.save(phoneNumberUser));
			userHasPhoneNumbers = true;
		}
		
		return savePhoneNumberUser;
	}

	@Override
	public PhoneNumberUser updatePhoneNumberUser(Integer phoneNumberUserId, PhoneNumberUser updatePhoneNumber) {
		PhoneNumberUser phoneNumberUser = phoneNumberUserDAO.findById(phoneNumberUserId).get();
		if (updatePhoneNumber.getActive() != null) {
	        boolean isCurrentlyActive = phoneNumberUser.getActive();

	        if (isCurrentlyActive && !updatePhoneNumber.getActive()) { // Nếu đang active=true
	            // Tìm sđt khác có active=false
	            List<PhoneNumberUser> otherPhoneNumbers = phoneNumberUserDAO.findByUser_Username(phoneNumberUser.getUser().getUsername());
	            for (PhoneNumberUser otherPhoneNumber : otherPhoneNumbers) {
	                if (!otherPhoneNumber.getPhoneNumberUserId().equals(phoneNumberUserId) && !otherPhoneNumber.getActive()) {
	                    otherPhoneNumber.setActive(true);
	                    phoneNumberUserDAO.save(otherPhoneNumber);
	                    break;
	                }
	            }
	            phoneNumberUser.setActive(false);
	        } else if (!isCurrentlyActive && updatePhoneNumber.getActive()) { // Nếu đang active=false
	            // Tìm và đặt tất cả các số khác về active=false
	            List<PhoneNumberUser> otherPhoneNumbers = phoneNumberUserDAO.findByUser_Username(phoneNumberUser.getUser().getUsername());
	            for (PhoneNumberUser otherPhoneNumber : otherPhoneNumbers) {
	                if (!otherPhoneNumber.getPhoneNumberUserId().equals(phoneNumberUserId) && otherPhoneNumber.getActive()) {
	                    otherPhoneNumber.setActive(false);
	                    phoneNumberUserDAO.save(otherPhoneNumber);
	                }
	            }
	            phoneNumberUser.setActive(true);
	        }
	    }
		
		return phoneNumberUserDAO.save(phoneNumberUser);
	}

	@Override
	public PhoneNumber getCheckPhoneNumber(String phoneNumber) {
		return phoneNumberDAO.findByPhoneNumber(phoneNumber);
	}
}
