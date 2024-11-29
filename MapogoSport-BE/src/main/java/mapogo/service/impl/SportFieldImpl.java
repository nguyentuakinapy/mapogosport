package mapogo.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import mapogo.dao.SportFieldDAO;
import mapogo.dto.SportFieldDTO;
import mapogo.entity.CategoryField;
import mapogo.entity.Owner;
import mapogo.entity.SportField;
import mapogo.service.CategoryFieldService;
import mapogo.service.OwnerService;
import mapogo.service.SportFieldService;

@Service
public class SportFieldImpl implements SportFieldService{

	@Autowired
	SportFieldDAO sportFieldDao;
	
	@Override
	public List<SportField> findAll() {
		return sportFieldDao.findAll();
	}

	@Override
	public SportField findBySportFieldId(Integer Id) {
		Optional<SportField> sportField = sportFieldDao.findById(Id);
		return sportField.get();
	}

	@Override
	public List<SportField> findSportFieldByOwner(Integer id) {
		return sportFieldDao.findSportFieldByOwner(id);
	}
	@Autowired
	CategoryFieldService cateService;
	@Autowired
	OwnerService ownerService;
	@Autowired
	private Cloudinary cloudinary;
	@Override
	public SportField create(SportFieldDTO sportFieldDTO, MultipartFile avatar) {
		SportField sportField = new SportField();
		sportField.setName(sportFieldDTO.getName());
		sportField.setAddress(sportFieldDTO.getAddress());
		sportField.setOpening(sportFieldDTO.getOpening());
		sportField.setClosing(sportFieldDTO.getClosing());
		CategoryField cate = cateService.findById(sportFieldDTO.getCategoriesField());
		sportField.setCategoriesField(cate);
		sportField.setQuantity(0);
		sportField.setStatus(sportFieldDTO.getStatus());
		
		if (!avatar.isEmpty()) {
			// Upload ảnh lên Cloudinary
			Map<String, Object> uploadResult;
			try {
				uploadResult = cloudinary.uploader().upload(avatar.getBytes(),
						ObjectUtils.emptyMap());
				// Lấy URL của ảnh từ kết quả upload
			String imageUrl = (String) uploadResult.get("secure_url");
			System.err.println("Uploaded image URL: " + imageUrl);
			sportField.setImage(imageUrl); // Lưu URL vào cơ sở dữ liệu

			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		Owner owner = ownerService.findByUsername(sportFieldDTO.getOwner());
		sportField.setOwner(owner);
		sportField.setDecription(sportFieldDTO.getDecription());

		return sportFieldDao.save(sportField);
	}

	@Override
	public SportField update(SportFieldDTO sportFieldDTO, MultipartFile avatar) {
		SportField sportField = sportFieldDao.findById(sportFieldDTO.getSportFieldId())
	            .orElse(new SportField());		
		sportField.setName(sportFieldDTO.getName());
		sportField.setAddress(sportFieldDTO.getAddress());
		sportField.setOpening(sportFieldDTO.getOpening());
		sportField.setClosing(sportFieldDTO.getClosing());
		CategoryField cate = cateService.findById(sportFieldDTO.getCategoriesField());
		sportField.setCategoriesField(cate);
		int quan = sportField.getSportFielDetails().size();
		sportField.setQuantity(quan);
		sportField.setStatus(sportFieldDTO.getStatus());
		
	    if (avatar != null && !avatar.isEmpty()) {
			// Upload ảnh lên Cloudinary
			Map<String, Object> uploadResult;
			try {
				uploadResult = cloudinary.uploader().upload(avatar.getBytes(),
						ObjectUtils.emptyMap());
				// Lấy URL của ảnh từ kết quả upload
			String imageUrl = (String) uploadResult.get("secure_url");
			System.err.println("Uploaded image URL: " + imageUrl);
			sportField.setImage(imageUrl); // Lưu URL vào cơ sở dữ liệu

			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		sportField.setDecription(sportFieldDTO.getDecription());

		return sportFieldDao.save(sportField);
	}

}
